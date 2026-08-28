import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { signal, WritableSignal, Provider } from '@angular/core';
import { OnboardingComponent } from './onboarding.component';
import { InitialPageComponent } from './step-pages/initial-page/initial-page.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { OnboardLongTermGoalsComponent } from './step-pages/onboard-long-term-goals/onboard-long-term-goals.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { UserStore } from 'src/app/core/store/user/user.store';
import { OnboardingState, User } from 'src/app/core/store/user/user.model';
import { createMockUser } from 'src/app/core/store/user/user.mock';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';

/**
 * A minimal, reactive AuthStore + UserStore test double pair, sharing one
 * `user` signal so a fake `UserStore.update()` write is reflected back through
 * `AuthStore.user()` — mirroring how, in production, both stores read/write the
 * same underlying `users` collection. `UserStore.update()`'s real loading/error
 * handling (set loading, log + rethrow on failure) is replicated here so the
 * component's actual behavior — no manual try/catch, relies entirely on the
 * store — is exercised faithfully. `AuthLoggedInMockDB`
 * (src/app/core/store/auth/auth.mock.ts) isn't used because its `user` shape
 * (`{ uid, displayName, ... }`) doesn't match the real `User` entity shape
 * (`{ __id, name, ... }`) this component actually reads.
 */
function createUserStoreFakes(initialUser: User | undefined, options: { shouldFail?: boolean } = {}) {
  const user: WritableSignal<User> = signal(initialUser);
  const fakeAuthStore = { user };
  const fakeUserStore = {
    async update(
      id: string,
      changes: Partial<User>,
      updateOptions?: { loading?: WritableSignal<boolean> },
    ): Promise<void> {
      updateOptions?.loading?.set(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (options.shouldFail) {
          throw new Error('Simulated write failure');
        }
        user.set({ ...user(), ...changes });
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        updateOptions?.loading?.set(false);
      }
    },
  };
  return { fakeAuthStore, fakeUserStore };
}

/**
 * Sets up the testing environment for OnboardingComponent.
 * @param signedInUser - The user to render as signed-in, or `null` to simulate no user loaded yet.
 * @param shouldFail - Whether the fake UserStore.update() write should reject.
 * @param providers - Optional additional providers to override defaults.
 */
async function setup({
  signedInUser = createMockUser({ name: 'Jennifer Smith', onboardingState: OnboardingState.WELCOME }),
  shouldFail = false,
  providers = [],
}: {
  signedInUser?: User | null;
  shouldFail?: boolean;
  providers?: Provider[];
} = {}) {
  const user = userEvent.setup();
  const { fakeAuthStore, fakeUserStore } = createUserStoreFakes(signedInUser ?? undefined, { shouldFail });

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
      { provide: UserStore, useValue: fakeUserStore },
      ...providers,
    ],
  });

  return { user, fixture: view.fixture, fakeAuthStore, fakeUserStore };
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
    await setup({ signedInUser: null });

    expect(screen.queryByRole('heading', { name: /Welcome/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('re-enables Next and keeps rendering the Welcome step if the write fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { user } = await setup({ shouldFail: true });

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
