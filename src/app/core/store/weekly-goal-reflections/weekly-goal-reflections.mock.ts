import { Timestamp } from '@angular/fire/firestore';
import { WeeklyGoalReflections } from './weekly-goal-reflections.model';
import { withEntitiesForMockDB } from 'src/app/core/store/app.store';
import { signalStore } from '@ngrx/signals';

export const WeeklyGoalReflectionsMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<WeeklyGoalReflections>(),
);

export const WEEKLYGOALREFLECTIONS_DB = [
];
