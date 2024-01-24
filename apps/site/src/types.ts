type BaseResumeItem = {
  start: string;
  end: string;
  url: string
};

export interface ResumeItem extends BaseResumeItem {
  type: "work" | "academic";
  degree?: string;
  school?: string;
  employer?: string;
  position?: string;
}

export interface AcademicItem extends BaseResumeItem {
  type: "academic";
  degree: string;
  school: string;
}

export interface WorkItem extends BaseResumeItem {
  type: "academic";
  employer: string;
  position: string;
}

export type ResumeItems = ResumeItem[];

export type TimelineItem = {
  startYear: string;
  endYear: string;
  title: string;
  subtitle?: string;
  url: string
};

export type TimelineItems = TimelineItem[];

export type BlogContent = {
  title: string;
  description: string;
  pubDate: Date | string;
  updatedDate?: Date | string;
  heroImage?: string;
  tags?: string[];
};
