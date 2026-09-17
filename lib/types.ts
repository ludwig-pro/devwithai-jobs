export type FilterTag = "Remote" | "CDI" | "Freelance" | "IA";

export type RawJob = {
  author: string;
  date_time_shown: string;
  message_text: string;
  urls: string[];
  slack_permalink: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  author: string;
  date: string;
  dateFull: string;
  excerpt: string;
  filterTags: FilterTag[];
  primaryUrl: string;
  permalink: string;
  accent: string;
  initials: string;
};
