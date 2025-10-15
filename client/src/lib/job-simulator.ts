import type { JobStatus } from "@shared/schema";

export class JobSimulator {
  private static instance: JobSimulator;
  private callbacks: Array<(jobId: string, status: JobStatus, error?: string) => void> = [];

  static getInstance() {
    if (!JobSimulator.instance) {
      JobSimulator.instance = new JobSimulator();
    }
    return JobSimulator.instance;
  }

  onStatusChange(callback: (jobId: string, status: JobStatus, error?: string) => void) {
    this.callbacks.push(callback);
  }

  private notifyStatusChange(jobId: string, status: JobStatus, error?: string) {
    this.callbacks.forEach(callback => callback(jobId, status, error));
  }

  simulateJobTransition(jobId: string, currentStatus: JobStatus) {
    // Simulate realistic job state transitions
    const transitions: Record<JobStatus, { next: JobStatus; probability: number; delay: number }[]> = {
      queued: [
        { next: "running", probability: 0.7, delay: 5000 },
        { next: "cancelled", probability: 0.05, delay: 2000 },
      ],
      running: [
        { next: "done", probability: 0.85, delay: 30000 },
        { next: "failed", probability: 0.15, delay: 10000 },
      ],
      done: [],
      failed: [],
      cancelled: [],
    };

    const possibleTransitions = transitions[currentStatus];
    if (possibleTransitions.length === 0) return;

    // Select a random transition based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const transition of possibleTransitions) {
      cumulativeProbability += transition.probability;
      if (random <= cumulativeProbability) {
        setTimeout(() => {
          const error = transition.next === "failed" ? "Quantum circuit execution error" : undefined;
          this.notifyStatusChange(jobId, transition.next, error);
        }, transition.delay + Math.random() * 10000); // Add some randomness
        break;
      }
    }
  }
}
