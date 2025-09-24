import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIJobAssistant } from "@/components/ai/ai-job-assistant";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertJobSchema, type InsertJob } from "@shared/schema";
import { useCreateJob, useBackends } from "@/hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";

interface JobFormProps {
  onClose: () => void;
}

const formVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export function JobForm({ onClose }: JobFormProps) {
  const { data: backends = [] } = useBackends();
  const createJob = useCreateJob();
  const { toast } = useToast();

  const form = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      name: "",
      backend: "",
      status: "queued",
      qubits: 5,
      shots: 1024,
      program: "// Quantum Circuit\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()",
      tags: [],
    },
  });

  const onSubmit = async (data: InsertJob) => {
    try {
      await createJob.mutateAsync(data);
      toast({
        title: "Job submitted successfully",
        description: `Job "${data.name}" has been queued for execution`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to submit job",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    }
  };

  const availableBackends = backends.filter(b => b.status === "available" || b.status === "busy");

  // Get current form values for AI assistant
  const watchedValues = form.watch();
  const jobData = {
    qubits: watchedValues.qubits || 0,
    shots: watchedValues.shots || 0,
    backend: watchedValues.backend || "",
    program: watchedValues.program || ""
  };

  // Handle AI suggestions
  const handleSuggestionApply = (suggestion: string) => {
    toast({
      title: "AI Suggestion",
      description: suggestion,
    });
  };

  const handleCircuitGenerate = (code: string) => {
    form.setValue("program", code);
    toast({
      title: "Circuit Generated",
      description: "AI-generated circuit code has been applied to your job",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl"
      >
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Submit New Quantum Job</h2>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-form">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Quantum Experiment"
                            {...field}
                            data-testid="input-job-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backend</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-backend">
                              <SelectValue placeholder="Select quantum computer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableBackends.map((backend) => (
                              <SelectItem key={backend.id} value={backend.name}>
                                {backend.name} ({backend.qubits} qubits, Queue: {backend.queueLength})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="qubits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Qubits</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="127"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-qubits"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Shots</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger data-testid="select-shots">
                              <SelectValue placeholder="Select shots" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1024">1,024</SelectItem>
                            <SelectItem value="2048">2,048</SelectItem>
                            <SelectItem value="4096">4,096</SelectItem>
                            <SelectItem value="8192">8,192</SelectItem>
                            <SelectItem value="16384">16,384</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantum Circuit Code</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your quantum circuit code..."
                          className="min-h-[120px] font-mono text-sm"
                          {...field}
                          data-testid="textarea-program"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AI Assistant */}
                <AIJobAssistant 
                  jobData={jobData}
                  onSuggestionApply={handleSuggestionApply}
                  onCircuitGenerate={handleCircuitGenerate}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={createJob.isPending}
                    data-testid="button-submit-job"
                  >
                    {createJob.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {createJob.isPending ? "Submitting..." : "Submit Job"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}