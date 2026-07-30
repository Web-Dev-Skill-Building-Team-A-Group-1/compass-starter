// Add any extra data types you'll need here!
import { WeeklyGoal } from '../../core/store/weekly-goal/weekly-goal.model';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';
import { QuarterlyGoal } from '../../core/store/quarterly-goal/quarterly-goal.model';
import { endOfWeek, startOfWeek } from '../../core/utils/time.utils';

export{ WeeklyGoal, QuarterlyGoal }

export interface WeeklyGoalData extends WeeklyGoal{ hashtag: Hashtag }

