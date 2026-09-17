import JobsBoard from "@/components/JobsBoard";
import { loadJobs } from "@/lib/load-jobs";

export default function Home() {
  const jobs = loadJobs();
  return <JobsBoard jobs={jobs} />;
}
