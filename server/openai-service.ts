import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Job, Backend } from '@shared/schema';

class OpenAIQuantumService {
  private genAI: GoogleGenerativeAI | undefined;
  private model: any;
  private isConfigured: boolean = false;
  private initializationAttempted: boolean = false;

  constructor() {
    // Don't initialize immediately - wait for first use
    // This ensures environment variables are loaded
  }

  private initializeIfNeeded(): void {
    if (this.initializationAttempted) {
      return;
    }
    this.initializationAttempted = true;

    // Debug: Log environment variable status
    const rawApiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    console.log('[Gemini Service] Initializing...');
    console.log('[Gemini Service] Raw API key exists:', !!rawApiKey);
    console.log('[Gemini Service] Raw API key length:', rawApiKey?.length || 0);
    console.log('[Gemini Service] Raw API key preview:', rawApiKey ? rawApiKey.substring(0, 15) + '...' : 'N/A');
    console.log('[Gemini Service] All env keys:', Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('OPENAI')).join(', '));
    
    const apiKey = rawApiKey?.trim();
    if (apiKey) {
      // Validate API key format (should start with 'AIza')
      if (!apiKey.startsWith('AIza')) {
        console.warn('⚠️  Gemini API key format appears invalid (should start with "AIza")');
        console.warn('⚠️  Received key starts with:', apiKey.substring(0, 10) + '...');
        console.warn('⚠️  AI features will be disabled');
        this.isConfigured = false;
        return;
      }
      
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash as requested by user
        this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
        this.isConfigured = true;
        console.log('✅ Gemini service configured for quantum analysis');
        console.log('   API Key format: Valid (starts with AIza)');
        console.log('   API Key length:', apiKey.length);
        console.log('   Model: models/gemini-2.5-flash');
      } catch (error: any) {
        console.error('❌ Failed to initialize Gemini client:', error.message);
        console.error('   Error details:', error);
        this.isConfigured = false;
      }
    } else {
      console.log('⚠️  Gemini API key not found in environment variables');
      console.log('   Checked: process.env.GEMINI_API_KEY =', process.env.GEMINI_API_KEY ? `exists but empty/whitespace (length: ${process.env.GEMINI_API_KEY.length})` : 'undefined');
      console.log('   Checked: process.env.OPENAI_API_KEY =', process.env.OPENAI_API_KEY ? `exists (length: ${process.env.OPENAI_API_KEY.length})` : 'undefined');
      console.log('   After trim:', apiKey ? `exists (length: ${apiKey.length})` : 'empty/undefined');
      console.log('💡 To enable AI features:');
      console.log('   1. Get API key from https://aistudio.google.com/app/apikey');
      console.log('   2. Add GEMINI_API_KEY=your_key_here to .env file (no quotes, no spaces)');
      console.log('   3. Ensure .env file is in the project root directory');
      console.log('   4. Restart the server');
      this.isConfigured = false;
    }
  }

  async generateJobSuggestions(jobData: {
    qubits: number;
    shots: number;
    backend: string;
    program?: string;
  }): Promise<{
    circuitSuggestions: string[];
    optimizationTips: string[];
    backendRecommendations: string[];
    estimatedRuntime: string;
  }> {
    this.initializeIfNeeded();
    if (!this.isConfigured) {
      return this.getFallbackSuggestions();
    }

    try {
      if (!this.model) {
        return this.getFallbackSuggestions();
      }

      const prompt = `As a quantum computing expert, analyze this quantum job configuration and provide suggestions:

Qubits: ${jobData.qubits}
Shots: ${jobData.shots}
Backend: ${jobData.backend}
Circuit: ${jobData.program || 'Not provided'}

Please provide:
1. Circuit improvement suggestions (max 3)
2. Optimization tips for better performance (max 3)
3. Backend recommendations if current choice isn't optimal (max 2)
4. Estimated runtime category (Very Fast/Fast/Medium/Slow/Very Slow)

Format your response as JSON with keys: circuitSuggestions, optimizationTips, backendRecommendations, estimatedRuntime`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (content) {
        try {
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback');
          return this.getFallbackSuggestions();
        }
      }
    } catch (error: any) {
      console.error('Gemini API error in generateJobSuggestions:', error);
      if (error?.status === 401 || error?.status === 403) {
        console.error('❌ Gemini API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ Gemini rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackSuggestions();
  }

  async analyzeFailedJob(job: Job): Promise<{
    possibleCauses: string[];
    suggestions: string[];
    circuitImprovements: string[];
    preventionTips: string[];
  }> {
    this.initializeIfNeeded();
    if (!this.isConfigured) {
      return this.getFallbackFailureAnalysis();
    }

    try {
      if (!this.model) {
        return this.getFallbackFailureAnalysis();
      }

      const prompt = `Analyze this failed quantum job and provide insights:

Job ID: ${job.id}
Name: ${job.name}
Backend: ${job.backend}
Qubits: ${job.qubits}
Shots: ${job.shots}
Error: ${job.error || 'No specific error message'}
Circuit: ${job.program || 'Circuit not available'}
Duration: ${job.duration || 0} seconds

As a quantum computing expert, provide:
1. Most likely causes for the failure (max 3)
2. Specific suggestions to fix the issue (max 3)
3. Circuit improvements to prevent similar failures (max 3)
4. General prevention tips (max 2)

Format as JSON with keys: possibleCauses, suggestions, circuitImprovements, preventionTips`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (content) {
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI failure analysis, using fallback');
          return this.getFallbackFailureAnalysis();
        }
      }
    } catch (error: any) {
      console.error('Gemini API error in analyzeFailedJob:', error);
      if (error?.status === 401 || error?.status === 403) {
        console.error('❌ Gemini API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ Gemini rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackFailureAnalysis();
  }

  async generateCircuitCode(description: string, qubits: number): Promise<string> {
    this.initializeIfNeeded();
    if (!this.isConfigured) {
      return this.getFallbackCircuitCode(qubits);
    }

    try {
      if (!this.model) {
        return this.getFallbackCircuitCode(qubits);
      }

      const prompt = `Generate Qiskit quantum circuit code for: "${description}"
      
Requirements:
- Use exactly ${qubits} qubits
- Include necessary imports
- Create a complete, runnable circuit
- Add measurement instructions
- Include helpful comments

Return only the Python/Qiskit code:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (content) {
        // Extract code from response (remove markdown formatting if present)
        return content.replace(/```python\n?|```\n?/g, '').trim();
      }
    } catch (error: any) {
      console.error('Gemini API error in generateCircuitCode:', error);
      if (error?.status === 401 || error?.status === 403) {
        console.error('❌ Gemini API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ Gemini rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackCircuitCode(qubits);
  }

  private getFallbackSuggestions() {
    return {
      circuitSuggestions: [
        "Consider reducing circuit depth for better fidelity",
        "Add error mitigation techniques like ZNE",
        "Optimize gate placement to minimize crosstalk"
      ],
      optimizationTips: [
        "Use fewer shots for faster execution in testing",
        "Choose backends with better coherence times",
        "Consider variational algorithms for complex problems"
      ],
      backendRecommendations: [
        "ibm_brisbane for high-fidelity operations",
        "ibm_kyoto for larger qubit counts"
      ],
      estimatedRuntime: "Medium"
    };
  }

  private getFallbackFailureAnalysis() {
    return {
      possibleCauses: [
        "Circuit depth exceeded decoherence time",
        "Backend calibration issues during execution",
        "Queue timeout or system maintenance"
      ],
      suggestions: [
        "Reduce circuit complexity and depth",
        "Try a different backend with better uptime",
        "Implement error mitigation strategies"
      ],
      circuitImprovements: [
        "Use native gate sets for the target backend",
        "Minimize two-qubit gate operations",
        "Add error correction codes where possible"
      ],
      preventionTips: [
        "Monitor backend status before job submission",
        "Test with fewer shots initially"
      ]
    };
  }

  async chat(message: string): Promise<string> {
    this.initializeIfNeeded();
    if (!this.isConfigured) {
      return "I'm sorry, but the AI assistant is not currently available. Please check if the Gemini API key is configured properly.";
    }

    try {
      if (!this.model) {
        return "I'm sorry, but the AI assistant is not currently available. Please check if the Gemini API key is configured properly.";
      }

      const systemPrompt = `You are a helpful and knowledgeable AI assistant. Give clear, direct answers to user questions.

Key guidelines:
- Answer questions directly and concisely
- Be helpful and informative 
- If asked about quantum computing, provide accurate technical information
- If asked about the dashboard, explain features and functionality
- For general questions, give straightforward, useful responses
- Keep answers focused and to the point

You are integrated into a quantum computing job management dashboard that tracks IBM Quantum jobs, backends, and analytics. You can help users understand quantum computing concepts, explain dashboard features, or answer any other questions they have.`;

      const fullPrompt = `${systemPrompt}\n\nUser question: ${message}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const content = response.text();

      return content || "I'm sorry, I couldn't generate a response at the moment.";
    } catch (error: any) {
      console.error('Gemini API error in chat:', error);
      
      // Provide more detailed error messages
      if (error?.status === 401 || error?.status === 403) {
        return "❌ Authentication failed. Please check if the Gemini API key is valid and has proper permissions.";
      } else if (error?.status === 429) {
        return "⚠️ Rate limit exceeded. Please wait a moment and try again.";
      } else if (error?.status === 500) {
        return "⚠️ Gemini service is temporarily unavailable. Please try again later.";
      } else if (error?.message) {
        return `⚠️ Error: ${error.message}. Please check your Gemini API configuration.`;
      }
      
      return "I'm experiencing some technical difficulties right now. Please try again in a moment.";
    }
  }

  isServiceConfigured(): boolean {
    this.initializeIfNeeded();
    return this.isConfigured;
  }

  private getFallbackCircuitCode(qubits: number): string {
    return `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister

# Create quantum and classical registers
qreg = QuantumRegister(${qubits}, 'q')
creg = ClassicalRegister(${qubits}, 'c')

# Create the quantum circuit
circuit = QuantumCircuit(qreg, creg)

# Example: Create superposition state
for i in range(${qubits}):
    circuit.h(qreg[i])

# Add measurements
circuit.measure(qreg, creg)

print(circuit)`;
  }

  // Method to get detailed circuit improvement instructions
  async getCircuitInstructions(job: Job): Promise<string> {
    this.initializeIfNeeded();
    if (!this.isConfigured) {
      return `
AI Circuit Improvement Instructions for "${job.name}":

Based on your quantum job configuration:
- Qubits: ${job.qubits}
- Shots: ${job.shots}
- Backend: ${job.backend}

Here are detailed circuit improvement instructions:

1. Circuit Depth Optimization:
   • Reduce gate depth by combining consecutive gates
   • Use native gate sets for your target hardware
   • Replace multi-qubit gates with hardware-efficient alternatives

2. Error Mitigation Strategies:
   • Implement dynamical decoupling sequences
   • Use error correction codes for critical qubits
   • Add redundancy for error-prone operations

3. Noise-Resilient Design:
   • Choose qubit mappings that minimize crosstalk
   • Implement variational quantum algorithms with noise robustness
   • Use short coherence gates and minimize idle times

4. Hardware-Specific Optimizations:
   • Optimize for ${job.backend} connectivity graph
   • Use native gate implementations
   • Account for specific error rates and calibration data

5. Measurement Strategies:
   • Use tomography for complete state characterization
   • Implement partial measurements for reduced readout error
   • Consider ancilla-assisted measurements for error detection

Apply these techniques systematically to improve your quantum circuit performance.
      `;
    }

    try {
      const prompt = `Provide detailed circuit improvement instructions for this quantum job:

Job: ${job.name}
Qubits: ${job.qubits}
Shots: ${job.shots}
Backend: ${job.backend}
Program: ${job.program?.substring(0, 200) || 'Not provided'}...
Status: ${job.status}
Error: ${job.error || 'None'}

Please provide comprehensive, actionable instructions on:
1. Circuit optimization techniques
2. Error mitigation strategies  
3. Hardware-specific improvements
4. Noise reduction methods
5. Measurement optimization

Make it practical and specific to this configuration.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return content || 'Unable to generate instructions';
    } catch (error) {
      console.error('Error getting circuit instructions:', error);
      return 'Unable to generate AI-powered circuit instructions at this time.';
    }
  }

  // Method to get guided circuit improvements
  async getGuidedImprovements(job: Job): Promise<string[]> {
    this.initializeIfNeeded();
    if (!this.isConfigured) {
      return [
        `Apply quantum error correction codes for ${job.qubits}-qubit systems`,
        `Implement dynamical decoupling on ${job.backend} hardware`,
        `Use variational quantum algorithms optimized for ${job.shots} shots`,
        'Optimize gate scheduling to minimize decoherence',
        'Add measurement error mitigation techniques'
      ];
    }

    try {
      const prompt = `Generate guided improvements for this quantum job:

Job: ${job.name}
Configuration: ${job.qubits} qubits, ${job.shots} shots on ${job.backend}
Current Status: ${job.status}
Program: ${job.program?.substring(0, 150) || 'Not provided'}

Provide 4-6 specific improvement suggestions as a JSON array. Focus on:
- Circuit optimization techniques
- Hardware-specific improvements
- Error mitigation methods
- Performance enhancements

Return format: ["improvement 1", "improvement 2", ...]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(content || '[]');
      } catch {
        // If JSON parsing fails, split the response into lines
        return content?.split('\n').filter((line: string) => line.trim().length > 0) || [];
      }
    } catch (error) {
      console.error('Error getting guided improvements:', error);
      return ['Unable to generate AI-powered guided improvements at this time.'];
    }
  }
}

export const openaiService = new OpenAIQuantumService();
