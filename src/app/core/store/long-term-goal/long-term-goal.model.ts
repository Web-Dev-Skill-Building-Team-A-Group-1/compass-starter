import { Timestamp } from '@angular/fire/firestore';

export interface LongTermGoal {
  __id: string;
  __userId: string,
  oneYear: string, // What your one year goal is
  fiveYear: string; // What your five year goal is
  longTermGoalNotes?: string; // Overall notes for the notes page
  oneYearNotes?: string; // Notes on one year goal for the notes page
  fiveYearNotes?: string; // Notes on five year goal for the notes page
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
