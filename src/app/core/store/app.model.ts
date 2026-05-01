// Entity Models
import { WeeklyGoalReflections } from './weekly-goal-reflections/weekly-goal-reflections.model';
import { LongTermGoal } from './long-term-goal/long-term-goal.model';
import { QuarterlyGoal } from './quarterly-goal/quarterly-goal.model';
import { WeeklyGoal } from './weekly-goal/weekly-goal.model';
import { Hashtag } from './hashtag/hashtag.model';
import { User } from './user/user.model';

export type AnyEntity =
  WeeklyGoalReflections |
  LongTermGoal |
  QuarterlyGoal |
  WeeklyGoal |
  Hashtag |
  User;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryParams = [string, string, any][];

export type QueryOptions = {
  orderBy?: string | [string, string],
  limit?: number,
  startAt?: string,
  startAfter?: string,
  endAt?: string,
  endBefore?: string,
}
