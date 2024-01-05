import type { ResumeItem, TimelineItems } from "../types";

export function academicResumeToTimeline(items: ResumeItem[]): TimelineItems {
  return items
    .filter((item) => item.type === "academic")
    .map((item) => ({
      title: item.degree ?? "",
      subtitle: item.school ?? "",
      startYear: item.start,
      endYear: item.end,
      url: item.url,
    }));
}

export function workResumeToTimeline(items: ResumeItem[]): TimelineItems {
  return items
    .filter((item) => item.type === "work")
    .map((item) => ({
      title: item.position ?? "",
      subtitle: item.employer ?? "",
      startYear: item.start,
      endYear: item.end,
      url: item.url,
    }));
}
