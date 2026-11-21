import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { NotesAndResourcesAnimations } from './notes-and-resources.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { NotesHeaderComponent } from './notes-header/notes-header.component';
import { QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { HashtagStore } from 'src/app/core/store/hashtag/hashtag.store';

@Component({
  selector: 'app-notes-and-resources',
  templateUrl: './notes-and-resources.component.html',
  styleUrls: ['./notes-and-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: NotesAndResourcesAnimations,
  standalone: true,
  imports: [
    NotesHeaderComponent,
  ],
})
export class NotesAndResourcesComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly quarterGoalStore = inject(QuarterlyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /**
   * Route parameter value representing what goal we're taking notes on.
   * IMPORTANT: This can be either an id for a long term goal or quarterly goal,
   * which will significantly impact the UI and your queries!
   */
  goalId: Signal<string> = input.required<string>();

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------
  
  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    this.hashtagStore.load([['__userId', '==', this.currentUser().__id]], {});
    this.quarterGoalStore.load([['__userId', '==', this.currentUser().__id]], {});
  }
}
