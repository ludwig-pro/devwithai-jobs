import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobDetail from "@/components/JobDetail";
import { getJobById, loadJobs } from "@/lib/load-jobs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return loadJobs().map((j) => ({ id: j.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) {
    return { title: "Offre introuvable · Dev With AI Jobs" };
  }
  return {
    title: `${job.title} · Dev With AI Jobs`,
    description: job.excerpt || job.title,
  };
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();
  return <JobDetail job={job} />;
}
