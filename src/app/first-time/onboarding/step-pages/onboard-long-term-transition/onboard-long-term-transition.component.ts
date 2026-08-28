import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OnboardLongTermTransitionAnimations } from './onboard-long-term-transition.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';

@Component({
  selector: 'app-onboard-long-term-transition',
  templateUrl: './onboard-long-term-transition.component.html',
  styleUrls: ['./onboard-long-term-transition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: OnboardLongTermTransitionAnimations,
  standalone: true,
  imports: [
    MatButtonModule,
  ],
})
export class OnboardLongTermTransitionComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** Output event emitted to navigate to previous step. */
  readonly back = output<void>();

  /** Output event emitted to navigate to next step. */
  readonly next = output<void>();

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /** Handles clicking the back button. */
  onBack(): void {
    this.back.emit();
  }

  /** Handles clicking the next button. */
  onNext(): void {
    this.next.emit();
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
