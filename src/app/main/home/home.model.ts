// Add any extra data types you'll need here!
import { WeeklyGoal } from '../../core/store/weekly-goal/weekly-goal.model';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';

export interface WeeklyGoalData extends WeeklyGoal{ hashtag: Hashtag }

