import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Code, Lightbulb, Cpu, Clock, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AISuggestions {
  circuitSuggestions: string[];
  optimizationTips: string[];
  backendRecommendations: string[];
  estimatedRuntime: string;
}

interface AIJobAssistantProps {
  jobData: {
    qubits: number;
    shots: number;
    backend: string;
    program?: string;
  };
  onSuggestionApply: (suggestion: string) => void;
  onCircuitGenerate: (code: string) => void;
}

export function AIJobAssistant({ jobData, onSuggestionApply, onCircuitGenerate }: AIJobAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [circuitDescription, setCircuitDescription] = useState('');

  // Get AI suggestions based on current job configuration
  const { data: suggestions, isLoading: loadingSuggestions, refetch } = useQuery<AISuggestions>({
    queryKey: ['/api/ai/job-suggestions', jobData],
    queryFn: async () => {
      const response = await fetch('/api/ai/job-suggestions', {
        method: 'POST',
        body: JSON.stringify(jobData),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    enabled: jobData.qubits > 0 && jobData.shots > 0 && !!jobData.backend
  });

  // Generate circuit code mutation
  const generateCircuitMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await fetch('/api/ai/generate-circuit', {
        method: 'POST',
        body: JSON.stringify({
          description,
          qubits: jobData.qubits
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data.circuitCode;
    },
    onSuccess: (circuitCode) => {
      onCircuitGenerate(circuitCode);
      setCircuitDescription('');
    }
  });

  const handleGenerateCircuit = () => {
    if (circuitDescription.trim()) {
      generateCircuitMutation.mutate(circuitDescription.trim());
    }
  };

  const getRuntimeColor = (runtime: string) => {
    switch (runtime.toLowerCase()) {
      case 'very fast': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'fast': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'slow': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'very slow': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (!jobData.qubits || !jobData.shots || !jobData.backend) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Bot className="w-5 h-5 text-purple-500" />
            <span>Fill in job details to get AI-powered suggestions and optimizations</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Beta
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="button-toggle-ai-assistant"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              {/* Circuit Code Generator */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium">Generate Circuit Code</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circuit-description">Describe your quantum circuit:</Label>
                  <Textarea
                    id="circuit-description"
                    placeholder="e.g., Create a Bell state, implement Grover's algorithm, quantum teleportation..."
                    value={circuitDescription}
                    onChange={(e) => setCircuitDescription(e.target.value)}
                    className="min-h-[80px]"
                    data-testid="textarea-circuit-description"
                  />
                  <Button 
                    onClick={handleGenerateCircuit}
                    disabled={!circuitDescription.trim() || generateCircuitMutation.isPending}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    data-testid="button-generate-circuit"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {generateCircuitMutation.isPending ? 'Generating...' : 'Generate Code'}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* AI Suggestions */}
              {loadingSuggestions ? (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span>Analyzing your job configuration...</span>
                </div>
              ) : suggestions ? (
                <div className="space-y-4">
                  {/* Runtime Estimate */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Estimated Runtime:</span>
                    <Badge className={getRuntimeColor(suggestions.estimatedRuntime)}>
                      {suggestions.estimatedRuntime}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => refetch()}
                      className="ml-auto"
                      data-testid="button-refresh-suggestions"
                    >
                      <Sparkles className="w-3 h-3" />
                      Refresh
                    </Button>
                  </div>

                  {/* Circuit Suggestions */}
                  {suggestions.circuitSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-green-500" />
                        <h4 className="font-medium text-sm">Circuit Improvements</h4>
                      </div>
                      <div className="space-y-1">
                        {suggestions.circuitSuggestions.map((suggestion, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg text-sm"
                          >
                            <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="flex-1">{suggestion}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onSuggestionApply(suggestion)}
                              className="text-xs px-2 py-1"
                              data-testid={`button-apply-circuit-suggestion-${index}`}
                            >
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optimization Tips */}
                  {suggestions.optimizationTips.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium text-sm">Optimization Tips</h4>
                      </div>
                      <div className="space-y-1">
                        {suggestions.optimizationTips.map((tip, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg text-sm"
                          >
                            <Sparkles className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Backend Recommendations */}
                  {suggestions.backendRecommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-orange-500" />
                        <h4 className="font-medium text-sm">Backend Recommendations</h4>
                      </div>
                      <div className="space-y-1">
                        {suggestions.backendRecommendations.map((backend, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg text-sm"
                          >
                            <Cpu className="w-3 h-3 text-orange-500 flex-shrink-0" />
                            <span className="flex-1">{backend}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onSuggestionApply(backend)}
                              className="text-xs px-2 py-1"
                              data-testid={`button-apply-backend-suggestion-${index}`}
                            >
                              Consider
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Unable to generate suggestions. Please check your job configuration.
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}