import { Timestamp } from '@angular/fire/firestore';
import { withEntitiesForMockDB } from '../app.store';
import { signalStore } from '@ngrx/signals';
import { User, OnboardingState } from './user.model';

export const UserMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<User>(),
);

/** For Jest tests. Creates a mock User entity, with sensible defaults that can be overridden per test. */
export function createMockUser(overrides: Partial<User> = {}): User {
  return Object.assign({
    __id: 'mock-user-1',
    email: 'jennifer@sample.com',
    name: 'Jennifer Smith',
    photoURL: '/images/tech4good-logo.png',
    onboardingState: OnboardingState.WELCOME,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  }, overrides);
}

export const USER_DB: User[] = [
  {
    __id: '1',
    email: 'a@sample.com',
    name: 'User A',
    photoURL: '/images/tech4good-logo.png',
    onboardingState: OnboardingState.DONE,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
  {
    __id: '2',
    email: 'b@sample.com',
    name: 'User Bob',
    photoURL: '/images/tech4good-logo.png',
    onboardingState: OnboardingState.DONE,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
  {
    __id: '3',
    email: 'c@sample.com',
    name: 'User C',
    photoURL: '/images/tech4good-logo.png',
    onboardingState: OnboardingState.DONE,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
];