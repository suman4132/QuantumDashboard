import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bot, Lightbulb, Wrench, Shield, RefreshCw, ChevronRight, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface FailureAnalysis {
  possibleCauses: string[];
  suggestions: string[];
  circuitImprovements: string[];
  preventionTips: string[];
}

interface AIFailureAnalysisProps {
  jobId: string;
  jobName?: string;
  error?: string;
  onRetryWithSuggestion?: (suggestion: string) => void;
}

export function AIFailureAnalysis({ jobId, jobName, error, onRetryWithSuggestion }: AIFailureAnalysisProps) {
  const [analysis, setAnalysis] = useState<FailureAnalysis | null>(null);
  const [showDetailedInstructions, setShowDetailedInstructions] = useState(false);
  const [detailedInstructions, setDetailedInstructions] = useState<string>('');

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai/analyze-failure/${jobId}`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    }
  });

  const handleAnalyze = () => {
    analyzeMutation.mutate();
  };

  // Get circuit improvement instructions
  const getCircuitInstructionsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai/circuit-instructions/${jobId}`, {
        method: 'POST'
      });
      const data = await response.json();
      return data.instructions;
    },
    onSuccess: (instructions) => {
      setDetailedInstructions(instructions);
      setShowDetailedInstructions(true);
    }
  });

  // Get guided circuit improvements
  const getGuidedImprovementsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai/guided-improvements/${jobId}`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: (improvements) => {
      // Apply guided improvements to the current analysis
      if (analysis && improvements) {
        setAnalysis({
          ...analysis,
          circuitImprovements: [...analysis.circuitImprovements, ...improvements]
        });
      }
    }
  });

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Failure Analysis</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Get insights on why this job failed and how to fix it
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {!analysis ? (
          <div className="text-center py-6">
            <Button 
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              data-testid="button-analyze-failure"
            >
              <Bot className="w-4 h-4 mr-2" />
              {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze Failure'}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Possible Causes */}
            {analysis.possibleCauses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h4 className="font-semibold text-sm">Possible Causes</h4>
                </div>
                <div className="space-y-2">
                  {analysis.possibleCauses.map((cause, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border-l-4 border-red-300"
                    >
                      <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{cause}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h4 className="font-semibold text-sm">Recommended Solutions</h4>
                </div>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-start gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border-l-4 border-yellow-300"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm">{suggestion}</span>
                      </div>
                      {onRetryWithSuggestion && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRetryWithSuggestion(suggestion)}
                          className="text-xs px-2 py-1"
                          data-testid={`button-apply-suggestion-${index}`}
                        >
                          Try This
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Circuit Improvements */}
            {analysis.circuitImprovements.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-500" />
                    <h4 className="font-semibold text-sm">Circuit Improvements</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getCircuitInstructionsMutation.mutate()}
                      disabled={getCircuitInstructionsMutation.isPending}
                      className="text-xs px-3 py-1 h-7"
                      data-testid="button-circuit-instructions"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      {getCircuitInstructionsMutation.isPending ? 'Loading...' : 'Get Instructions'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getGuidedImprovementsMutation.mutate()}
                      disabled={getGuidedImprovementsMutation.isPending}
                      className="text-xs px-3 py-1 h-7"
                      data-testid="button-guided-improvements"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {getGuidedImprovementsMutation.isPending ? 'Loading...' : 'Get AI Guide'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {analysis.circuitImprovements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="flex items-start gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border-l-4 border-blue-300"
                    >
                      <Wrench className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Detailed Instructions Panel */}
                {showDetailedInstructions && detailedInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-200">
                        Detailed Circuit Instructions
                      </h5>
                    </div>
                    <div className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">
                      {detailedInstructions}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetailedInstructions(false)}
                      className="mt-3 text-xs"
                      data-testid="button-hide-instructions"
                    >
                      Hide Instructions
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Prevention Tips */}
            {analysis.preventionTips.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <h4 className="font-semibold text-sm">Prevention Tips</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.preventionTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.9 }}
                        className="flex items-start gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border-l-4 border-green-300"
                      >
                        <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Re-analyze button */}
            <div className="pt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending}
                className="w-full"
                data-testid="button-reanalyze"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Re-analyze
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}