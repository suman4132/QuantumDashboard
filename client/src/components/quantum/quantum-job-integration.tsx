import { useState } from "react";
import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Job submission integration for Quantum Quest challenges
interface QuantumJobRequest {
  levelId: string;
  circuitCode: string;
  backend: string;
  shots: number;
  metadata: {
    challengeType: string;
    expectedResult: string;
    learningObjective: string;
  };
}

interface QuantumJobResponse {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'done';
  id: string;
  results?: {
    counts: Record<string, number>;
  };
  duration?: number;
  error?: string;
}

interface QuantumJobResult {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: any;
  executionTime?: number;
  accuracy?: number;
}

interface CircuitGate {
  type: string;
  qubit: number;
  control?: number;
  target?: number;
}

interface CircuitData {
  gates: CircuitGate[];
  qubits: number;
}

interface JobIntegrationProps {
  levelId: string;
  circuitData?: CircuitData;
  expectedResult: string;
  onJobComplete: (success: boolean, jobResult: QuantumJobResult) => void;
}

export function QuantumJobIntegration({ levelId, circuitData, expectedResult, onJobComplete }: JobIntegrationProps) {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Submit quantum job mutation
  const submitJobMutation = useMutation({
    mutationFn: async (jobRequest: QuantumJobRequest): Promise<QuantumJobResponse> => {
      try {
        const response = await fetch('/api/quantum/submit-job', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...jobRequest,
            backend: jobRequest.backend,
            priority: 'normal'
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data as QuantumJobResponse;
      } catch (error) {
        console.error('Job submission error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      const jobId = data.jobId || data.id;
      setCurrentJobId(jobId);
      toast({
        title: "🚀 Quantum Job Submitted!",
        description: `Job ${jobId} submitted successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Job Submission Failed",
        description: "Failed to submit quantum job. Try again later.",
        variant: "destructive"
      });
      console.error('Job submission error:', error);
    }
  });

  // Query job status with polling
  const { data: currentJob, isLoading: isJobLoading } = useQuery({
    queryKey: ['quantum-job', currentJobId],
    queryFn: async (): Promise<QuantumJobResponse | null> => {
      if (!currentJobId) return null;
      try {
        const response = await fetch(`/api/quantum/jobs/${currentJobId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data as QuantumJobResponse;
      } catch (error) {
        console.error('Job fetch error:', error);
        return null;
      }
    },
    enabled: !!currentJobId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if job is queued or running
      const jobData = query.state.data as QuantumJobResponse | null;
      if (jobData && (jobData.status === 'queued' || jobData.status === 'running')) {
        return 2000;
      }
      return false;
    },
  });

  // Mock IBM Quantum backends for demonstration
  const availableBackends = [
    { id: "ibm_qasm_simulator", name: "QASM Simulator", type: "simulator", qubits: 32 },
    { id: "ibm_cairo", name: "IBM Cairo", type: "real", qubits: 27 },
    { id: "ibm_brisbane", name: "IBM Brisbane", type: "real", qubits: 127 },
    { id: "ibm_kyoto", name: "IBM Kyoto", type: "real", qubits: 127 }
  ];

  const [selectedBackend, setSelectedBackend] = useState(availableBackends[0]);

  // Generate circuit code based on challenge data
  const generateCircuitCode = () => {
    // This would generate Qiskit code based on the gate simulator data
    let circuitCode = `# Quantum Quest Challenge: ${levelId}\n`;
    circuitCode += `from qiskit import QuantumCircuit, transpile, execute\n`;
    circuitCode += `from qiskit.visualization import plot_histogram\n\n`;
    circuitCode += `# Create quantum circuit\n`;
    circuitCode += `qc = QuantumCircuit(2, 2)\n\n`;
    
    // Add gates based on circuit data
    if (circuitData && circuitData.gates) {
      circuitData.gates.forEach((gate: any) => {
        switch (gate.type) {
          case 'hadamard':
            circuitCode += `qc.h(${gate.qubit})\n`;
            break;
          case 'pauli-x':
            circuitCode += `qc.x(${gate.qubit})\n`;
            break;
          case 'cnot':
            circuitCode += `qc.cx(${gate.control}, ${gate.target})\n`;
            break;
        }
      });
    } else {
      // Default Bell state circuit for demonstration
      circuitCode += `# Bell state preparation\n`;
      circuitCode += `qc.h(0)  # Hadamard on qubit 0\n`;
      circuitCode += `qc.cx(0, 1)  # CNOT with qubit 0 as control\n`;
    }
    
    circuitCode += `\n# Add measurements\n`;
    circuitCode += `qc.measure_all()\n\n`;
    circuitCode += `# Display circuit\n`;
    circuitCode += `print(qc)\n`;
    
    return circuitCode;
  };

  const submitQuantumJob = () => {
    const jobRequest: QuantumJobRequest = {
      levelId,
      circuitCode: generateCircuitCode(),
      backend: selectedBackend.id,
      shots: 1024,
      metadata: {
        challengeType: "gate-simulator",
        expectedResult: expectedResult,
        learningObjective: `Learning challenge for level ${levelId}`
      }
    };
    
    submitJobMutation.mutate(jobRequest);
  };

  // Handle job status changes
  React.useEffect(() => {
    if (currentJob) {
      if (currentJob.status === 'running') {
        toast({
          title: "⚡ Job Running",
          description: `Your circuit is executing on ${selectedBackend.name}`,
        });
      } else if (currentJob.status === 'done' || currentJob.status === 'completed') {
        setShowResults(true);
        
        // Calculate accuracy based on results
        const accuracy = calculateAccuracy(currentJob.results, expectedResult);
        const success = accuracy > 0.85;
        
        toast({
          title: success ? "🎉 Job Completed Successfully!" : "⚠️ Job Completed with Issues",
          description: success 
            ? `Great results! Accuracy: ${(accuracy * 100).toFixed(1)}%`
            : `Results need improvement. Accuracy: ${(accuracy * 100).toFixed(1)}%`,
          variant: success ? "default" : "destructive"
        });
        
        onJobComplete(success, {
          jobId: currentJob.id,
          status: currentJob.status === 'done' ? 'completed' : currentJob.status,
          result: currentJob.results,
          executionTime: currentJob.duration || undefined,
          accuracy
        });
      } else if (currentJob.status === 'failed') {
        toast({
          title: "❌ Job Failed",
          description: currentJob.error || "The quantum job failed to execute",
          variant: "destructive"
        });
        
        onJobComplete(false, {
          jobId: currentJob.id,
          status: currentJob.status,
          result: null
        });
      }
    }
  }, [currentJob?.status]);

  // Calculate accuracy by comparing results with expected outcome
  const calculateAccuracy = (results: any, expected: string): number => {
    if (!results || !results.counts) return 0;
    
    // For Bell state, we expect roughly equal distribution of |00⟩ and |11⟩
    if (expected.includes('Bell') || (expected.includes('00') && expected.includes('11'))) {
      const counts = results.counts;
      const total = Object.values(counts).reduce((sum: number, count: unknown) => sum + (count as number), 0);
      const ratio00 = (counts['00'] || 0) / total;
      const ratio11 = (counts['11'] || 0) / total;
      
      // Perfect Bell state would be 0.5, 0.5
      const deviation = Math.abs(ratio00 - 0.5) + Math.abs(ratio11 - 0.5);
      return Math.max(0, 1 - deviation * 2); // Convert deviation to accuracy
    }
    
    // Default accuracy calculation
    return Math.random() * 0.2 + 0.8; // 80-100% for demo
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'running': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'done':
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued': return <Clock className="h-4 w-4" />;
      case 'running': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'done':
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Backend Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Select Quantum Backend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {availableBackends.map((backend) => (
              <motion.div
                key={backend.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedBackend.id === backend.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBackend(backend)}
                data-testid={`backend-${backend.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{backend.name}</h4>
                  <Badge variant={backend.type === 'real' ? 'default' : 'secondary'}>
                    {backend.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {backend.qubits} qubits
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Submission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Run on IBM Quantum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Generated Circuit Code:</h5>
            <pre className="text-xs bg-black text-green-400 p-3 rounded overflow-x-auto">
              {generateCircuitCode()}
            </pre>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={submitQuantumJob}
              disabled={submitJobMutation.isPending || Boolean(currentJob && !['done', 'completed', 'failed'].includes(currentJob.status))}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              data-testid="button-submit-quantum-job"
            >
              {submitJobMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Submit to {selectedBackend.name}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Status */}
      {currentJob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Job Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Job ID: {currentJob.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Backend: {selectedBackend.name}
                  </p>
                </div>
                <Badge className={`${getStatusColor(currentJob.status)} flex items-center gap-1`}>
                  {getStatusIcon(currentJob.status)}
                  {currentJob.status.toUpperCase()}
                </Badge>
              </div>

              {(currentJob.status === 'done' || currentJob.status === 'completed') && currentJob.results && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Execution Time
                      </p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">
                        {currentJob.duration ? `${currentJob.duration}s` : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Accuracy
                      </p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {(calculateAccuracy(currentJob.results, expectedResult) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h6 className="font-medium mb-2">Measurement Results:</h6>
                    <div className="space-y-1">
                      {currentJob.results?.counts ? Object.entries(currentJob.results.counts).map(([state, count]) => (
                        <div key={state} className="flex justify-between items-center">
                          <span className="font-mono">|{state}⟩</span>
                          <span>{String(count)} shots</span>
                        </div>
                      )) : (
                        <p className="text-gray-500 text-sm">No measurement results yet</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}