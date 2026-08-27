import { Component, ChangeDetectionStrategy, inject, WritableSignal, Signal, signal, computed } from '@angular/core';
import { OnboardingAnimations } from './onboarding.animations';
import { User, OnboardingState } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { InitialPageComponent } from './step-pages/initial-page/initial-page.component';
import { OnboardLongTermGoalsComponent } from './step-pages/onboard-long-term-goals/onboard-long-term-goals.component';

/** Maps every OnboardingState to the 0-based index of its progress-bar marker. */
const PROGRESS_STEP_INDEX_BY_STATE: Record<OnboardingState, number> = {
  [OnboardingState.WELCOME]: 0,
  [OnboardingState.STEP_1]: 0,
  [OnboardingState.STEP_2]: 1,
  [OnboardingState.STEP_3]: 1,
  [OnboardingState.STEP_4]: 2,
  [OnboardingState.STEP_5]: 3,
  [OnboardingState.STEP_6]: 3,
  [OnboardingState.STEP_7]: 4,
  [OnboardingState.DONE]: 4,
};

const PROGRESS_STEPS = ['Long Term Goals', 'Quarter Goals', 'Organize', 'Weekly Goals', 'Organize'];

/**
 * Smart shell for the onboarding flow. Renders the step component that matches
 * the signed-in user's `onboardingState`, plus the persistent chrome (back
 * button, "Logout" link, and progress bar) shared across every step.
 *
 * Currently only wires the Welcome step (`OnboardingState.WELCOME`): clicking
 * "Next" advances the user to `STEP_1`, which renders `OnboardLongTermGoalsComponent`.
 * The back button and "Logout" link render per the Figma design but are not yet
 * wired to any behavior.
 */
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: OnboardingAnimations,
  imports: [MatIconButton, MatButton, MatIcon, ProgressBarComponent, InitialPageComponent, OnboardLongTermGoalsComponent],
})
export class OnboardingComponent {
  private readonly authStore = inject(AuthStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Whether the "advance past Welcome" write is in flight. */
  loading: WritableSignal<boolean> = signal(false);

  /** Static labels for the 5 progress-bar markers, shared across every step. */
  protected readonly progressBarSteps = PROGRESS_STEPS;

  // --------------- COMPUTED DATA -----------------------

  /** The onboarding step currently driving which step component renders. */
  activeStep = computed(() => this.currentUser()?.onboardingState);

  /** First name only, for the Welcome step's greeting. */
  firstName = computed(() => this.currentUser()?.name?.split(' ')[0] ?? '');

  /** 0-based progress-bar marker index for the current onboarding step. */
  progressBarStepIndex = computed(() => PROGRESS_STEP_INDEX_BY_STATE[this.activeStep()] ?? 0);

  // --------------- EVENT HANDLING ----------------------

  /**
   * Called when the Welcome step emits `next`. Advances the user's
   * onboarding state to STEP_1 so the long-term-goals step renders next.
   * On failure, logs the error and lets the user retry — there's no
   * dedicated error UI for this action (see architect-plan.md Appendix).
   */
  async handleNext(): Promise<void> {
    this.loading.set(true);
    try {
      await this.authStore.advanceOnboardingState(OnboardingState.STEP_1);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  // --------------- OTHER -------------------------------

  /** Exposed so the template's `@switch` can reference OnboardingState members. */
  protected readonly OnboardingState = OnboardingState;

  // --------------- LOAD AND CLEANUP --------------------
}
