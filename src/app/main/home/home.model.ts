import { endOfWeek, startOfWeek } from '../../core/utils/time.utils';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';
import { QuarterlyGoal } from '../../core/store/quarterly-goal/quarterly-goal.model';

export interface QuarterlyGoalData extends QuarterlyGoal{ hashtag: Hashtag }