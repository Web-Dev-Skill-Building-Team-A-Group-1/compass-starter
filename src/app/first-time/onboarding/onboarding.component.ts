import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { OnboardingAnimations } from './onboarding.animations';
import { User, OnboardingState } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { UserStore } from 'src/app/core/store/user/user.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { OnboardLongTermTransitionComponent } from './step-pages/onboard-long-term-transition/onboard-long-term-transition.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: OnboardingAnimations,
  imports: [
    OnboardLongTermTransitionComponent,
  ],
})
export class OnboardingComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly userStore = inject(UserStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  /** Expose OnboardingState enum for template switch routing. */
  readonly OnboardingState = OnboardingState;

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /**
   * Handles navigation back from Step 2 to Step 1.
   */
  async onStep2Back(): Promise<void> {
    const user = this.currentUser();
    if (user?.__id) {
      await this.userStore.update(user.__id, { onboardingState: OnboardingState.STEP_1 });
    }
  }

  /**
   * Handles navigation forward from Step 2 to Step 3.
   */
  async onStep2Next(): Promise<void> {
    const user = this.currentUser();
    if (user?.__id) {
      await this.userStore.update(user.__id, { onboardingState: OnboardingState.STEP_3 });
    }
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit() {
  }
}
