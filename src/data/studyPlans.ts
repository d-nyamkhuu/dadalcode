import definitions from "./study-plans.json";
import { catalog } from "./problems";
import type { CatalogEntry } from "../types";

export type PlanId = "beginner" | "experienced";
export type StudyGroup = {
  id: string;
  title: string;
  goal: string;
  problems: CatalogEntry[];
};
export type StudyPlan = {
  id: PlanId;
  title: string;
  description: string;
  groups: StudyGroup[];
};

const bySlug = new Map(catalog.map((problem) => [problem.slug, problem]));
export const difficulties = ["Easy", "Medium", "Hard"] as const;
export const studyPlans: StudyPlan[] = definitions.map((plan) => ({
  ...plan,
  id: plan.id as PlanId,
  groups: plan.groups.map(({ slugs, ...group }) => ({
    ...group,
    problems: slugs.map((slug) => {
      const problem = bySlug.get(slug);
      if (!problem) throw new Error(`Unknown study plan problem: ${slug}`);
      return problem;
    }),
  })),
}));

export function getStudyPlan(id: string | null | undefined) {
  return studyPlans.find((plan) => plan.id === id);
}

/** Follow the source roadmap: finish easy groups before medium and hard. */
export function orderedPlanProblems(plan: StudyPlan) {
  return difficulties.flatMap((difficulty) =>
    plan.groups.flatMap((group) =>
      group.problems.filter((problem) => problem.difficulty === difficulty),
    ),
  );
}

export function planProblemHref(slug: string, plan: StudyPlan, tab = "learn") {
  return `#/problems/${slug}/${tab}?plan=${plan.id}`;
}
