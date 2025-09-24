
import { useEffect, useRef } from "react";
import { useJobs } from "./use-jobs";
import { toast } from "./use-toast";
import type { Job } from "@shared/schema";

export function useJobNotifications() {
  const { data: jobsData } = useJobs(1, 100);
  const jobs = jobsData?.jobs || [];
  const prevJobsRef = useRef<Job[]>([]);

  useEffect(() => {
    const prevJobs = prevJobsRef.current;
    
    if (prevJobs.length === 0) {
      prevJobsRef.current = jobs;
      return;
    }

    // Check for newly completed jobs
    jobs.forEach(currentJob => {
      const prevJob = prevJobs.find(job => job.id === currentJob.id);
      
      if (prevJob && prevJob.status !== currentJob.status) {
        // Job status changed
        if (currentJob.status === "done") {
          toast({
            title: "Job Completed Successfully! ✅",
            description: `${currentJob.name} has finished running on ${currentJob.backend}`,
            duration: 5000,
          });
        } else if (currentJob.status === "failed") {
          toast({
            title: "Job Failed ❌",
            description: `${currentJob.name} failed on ${currentJob.backend}`,
            duration: 7000,
            variant: "destructive",
          });
        } else if (currentJob.status === "running" && prevJob.status === "queued") {
          toast({
            title: "Job Started 🚀",
            description: `${currentJob.name} is now running on ${currentJob.backend}`,
            duration: 3000,
          });
        }
      } else if (!prevJob && currentJob.status !== "queued") {
        // New job that's not in queue (likely just created)
        if (currentJob.status === "running") {
          toast({
            title: "New Job Started 🚀",
            description: `${currentJob.name} is running on ${currentJob.backend}`,
            duration: 3000,
          });
        }
      }
    });

    prevJobsRef.current = jobs;
  }, [jobs]);

  // Return notification counts for UI
  const recentCompletedJobs = jobs.filter(job => 
    (job.status === "done" || job.status === "failed") && 
    job.endTime && 
    new Date(job.endTime).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );
  
  const runningJobs = jobs.filter(job => job.status === "running");
  const queuedJobs = jobs.filter(job => job.status === "queued");

  return {
    recentCompletedJobs,
    runningJobs,
    queuedJobs,
    totalNotifications: recentCompletedJobs.length + runningJobs.length,
  };
}
