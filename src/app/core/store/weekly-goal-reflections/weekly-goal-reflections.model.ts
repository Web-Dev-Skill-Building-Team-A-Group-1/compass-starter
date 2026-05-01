import { Timestamp } from '@angular/fire/firestore';

export interface WeeklyGoalReflections {
  __id: string;
  __userId: string;
  startDate: Timestamp;
  endDate: Timestamp; // Reflection can extend over multiple weeks
  emotions: string; // Answer to "What emotions do you feel reflecting back on this past week?"
  challenges: string; // Answer to "Did you encounter any new challenges to reaching your goals?"
  helpfulResources: string; // Answer to "Did you find any resources, practices, or mindsets that helped?"
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
