import OpenAI from 'openai';
import type { Job, Backend } from '@shared/schema';

class OpenAIQuantumService {
  private client: OpenAI | undefined;
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
      this.isConfigured = true;
      console.log('✅ OpenAI service configured for quantum analysis');
    } else {
      console.log('⚠️  OpenAI API key not found - AI features will be disabled');
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
    if (!this.isConfigured) {
      return this.getFallbackSuggestions();
    }

    try {
      if (!this.client) {
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

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback');
          return this.getFallbackSuggestions();
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    return this.getFallbackSuggestions();
  }

  async analyzeFailedJob(job: Job): Promise<{
    possibleCauses: string[];
    suggestions: string[];
    circuitImprovements: string[];
    preventionTips: string[];
  }> {
    if (!this.isConfigured) {
      return this.getFallbackFailureAnalysis();
    }

    try {
      if (!this.client) {
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

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI failure analysis, using fallback');
          return this.getFallbackFailureAnalysis();
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    return this.getFallbackFailureAnalysis();
  }

  async generateCircuitCode(description: string, qubits: number): Promise<string> {
    if (!this.isConfigured) {
      return this.getFallbackCircuitCode(qubits);
    }

    try {
      if (!this.client) {
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

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        // Extract code from response (remove markdown formatting if present)
        return content.replace(/```python\n?|```\n?/g, '').trim();
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
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
    if (!this.isConfigured) {
      return "I'm sorry, but the AI assistant is not currently available. Please check if the OpenAI API key is configured properly.";
    }

    try {
      if (!this.client) {
        return "I'm sorry, but the AI assistant is not currently available. Please check if the OpenAI API key is configured properly.";
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

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.";
    } catch (error) {
      console.error('OpenAI API error in chat:', error);
      return "I'm experiencing some technical difficulties right now. Please try again in a moment.";
    }
  }

  isServiceConfigured(): boolean {
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

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a quantum computing expert. Provide detailed, step-by-step instructions for improving quantum circuits. Focus on practical, implementable recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      return response.choices[0].message.content || 'Unable to generate instructions';
    } catch (error) {
      console.error('Error getting circuit instructions:', error);
      return 'Unable to generate AI-powered circuit instructions at this time.';
    }
  }

  // Method to get guided circuit improvements
  async getGuidedImprovements(job: Job): Promise<string[]> {
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

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a quantum computing optimization expert. Provide specific, actionable improvements for quantum circuits. Return only a JSON array of improvement suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8
      });

      const content = response.choices[0].message.content;
      try {
        return JSON.parse(content || '[]');
      } catch {
        // If JSON parsing fails, split the response into lines
        return content?.split('\n').filter(line => line.trim().length > 0) || [];
      }
    } catch (error) {
      console.error('Error getting guided improvements:', error);
      return ['Unable to generate AI-powered guided improvements at this time.'];
    }
  }
}

export const openaiService = new OpenAIQuantumService();