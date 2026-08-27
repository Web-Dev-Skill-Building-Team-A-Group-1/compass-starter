import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { signal, WritableSignal, Provider } from '@angular/core';
import { OnboardingComponent } from './onboarding.component';
import { InitialPageComponent } from './step-pages/initial-page/initial-page.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { OnboardLongTermGoalsComponent } from './step-pages/onboard-long-term-goals/onboard-long-term-goals.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { OnboardingState, User } from 'src/app/core/store/user/user.model';
import { createMockUser } from 'src/app/core/store/user/user.mock';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';

/**
 * A minimal, reactive AuthStore test double. `advanceOnboardingState` updates the
 * local `user` signal after a short simulated delay (mimicking real write latency)
 * so tests can observe the pending/loading state and the reactive step transition.
 *
 * Note: this simulates, but does not exercise, AuthStore's real
 * `advanceOnboardingState` → `db.updateEntity` → Firestore listener → `user()`
 * update chain (that wiring is AuthStore's own concern). `AuthLoggedInMockDB`
 * (src/app/core/store/auth/auth.mock.ts) isn't used here because its `user` shape
 * (`{ uid, displayName, ... }`) doesn't match the real `User` entity shape
 * (`{ __id, name, ... }`) this component actually reads.
 */
function createFakeAuthStore(initialUser: User | undefined, options: { shouldFail?: boolean } = {}) {
  const user: WritableSignal<User> = signal(initialUser);
  return {
    user,
    async advanceOnboardingState(newState: OnboardingState): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (options.shouldFail) {
        throw new Error('Simulated write failure');
      }
      user.set({ ...user(), onboardingState: newState });
    },
  };
}

/**
 * Sets up the testing environment for OnboardingComponent.
 * @param providers - Optional additional providers to override defaults (e.g. a failing AuthStore).
 * @param signedInUser - The user to render as signed-in, or `undefined` to simulate no user loaded yet.
 */
async function setup(providers: Provider[] = [], signedInUser: User | null = createMockUser({
  name: 'Jennifer Smith',
  onboardingState: OnboardingState.WELCOME,
})) {
  const user = userEvent.setup();
  const fakeAuthStore = createFakeAuthStore(signedInUser ?? undefined);

  const view = await render(OnboardingComponent, {
    imports: [
      OnboardingComponent,
      InitialPageComponent,
      ProgressBarComponent,
      OnboardLongTermGoalsComponent,
    ],
    providers: [
      { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
      { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      { provide: AuthStore, useValue: fakeAuthStore },
      ...providers,
    ],
  });

  return { user, fixture: view.fixture, fakeAuthStore };
}

describe('OnboardingComponent Integration Tests', () => {
  it('renders the Welcome step with the first progress marker active, then advances to the long-term-goals step on Next', async () => {
    const { user } = await setup();

    // --- WELCOME STEP RENDERS ---
    expect(await screen.findByRole('heading', { name: /Welcome, Jennifer\./i })).toBeVisible();
    expect(screen.getByText(/Compass helps you set goals and reach them/i)).toBeVisible();

    // --- PROGRESS BAR REFLECTS onboardingState WELCOME AS THE FIRST STEP ---
    const steps = screen.getAllByRole('listitem');
    expect(steps[0]).toHaveAttribute('aria-current', 'step');

    // --- CLICK NEXT: SHOWS LOADING, THEN ADVANCES ---
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    await waitFor(() => {
      expect(nextBtn).toBeDisabled();
      expect(nextBtn).toHaveAttribute('aria-busy', 'true');
    });

    // --- WELCOME STEP IS REPLACED BY THE LONG-TERM-GOALS STEP ---
    // (Asserting on OnboardLongTermGoalsComponent's own placeholder text, since it's
    // an out-of-scope stub for this session — this line will need updating once
    // that component gets real content in a future implementation pass.)
    expect(await screen.findByText(/onboard-long-term-goals works!/i)).toBeVisible();
    expect(screen.queryByRole('heading', { name: /Welcome, Jennifer\./i })).not.toBeInTheDocument();

    // --- WELCOME and STEP_1 BOTH MAP TO PROGRESS INDEX 0 (not incorrectly advanced to 1) ---
    const stepsAfterAdvance = screen.getAllByRole('listitem');
    expect(stepsAfterAdvance[0]).toHaveAttribute('aria-current', 'step');
  });

  it('renders no step content and no chrome while the signed-in user has not yet loaded', async () => {
    await setup([], null);

    expect(screen.queryByRole('heading', { name: /Welcome/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('re-enables Next and keeps rendering the Welcome step if the write fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { user } = await setup([{ provide: AuthStore, useValue: createFakeAuthStore(
      createMockUser({ name: 'Jennifer Smith', onboardingState: OnboardingState.WELCOME }),
      { shouldFail: true },
    ) }]);

    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    await waitFor(() => {
      expect(nextBtn).not.toBeDisabled();
      expect(consoleSpy).toHaveBeenCalled();
    });
    expect(screen.getByRole('heading', { name: /Welcome, Jennifer\./i })).toBeVisible();

    consoleSpy.mockRestore();
  });
});
