import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatDialog } from '@angular/material/dialog';
import { WeeklyGoalsModalComponent } from './weekly-goals-modal/weekly-goals-modal.component';
import { WeeklyGoalsHeaderComponent } from './weekly-goals-header/weekly-goals-header.component';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { HashtagStore } from 'src/app/core/store/hashtag/hashtag.store';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsAnimations,
  standalone: true,
  imports: [
    WeeklyGoalsHeaderComponent,
  ],
})
export class WeeklyGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly dialog = inject(MatDialog);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  readonly hashtagStore = inject(HashtagStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /** Open the Weekly Goals modal, seeded with the current user's incomplete weekly goals, quarterly goals, and hashtags loaded from the database. */
  openGoalsModal() {
    const userId = this.currentUser().__id;
    const incompleteGoals = this.weeklyGoalStore.selectEntities(
      [['__userId', '==', userId], ['completed', '==', false]],
      {},
    );
    const goalDatas = this.quarterlyGoalStore.selectEntities(
      [['__userId', '==', userId]],
      {},
    );
    const hashtags = this.hashtagStore.selectEntities(
      [['__userId', '==', userId]],
      {},
    );

    this.dialog.open(WeeklyGoalsModalComponent, {
      width: '600px',
      data: {
        goalDatas,
        incompleteGoals,
        hashtags,
        openWithEmptyRow: false,
      },
    });
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    this.weeklyGoalStore.load([], {}, undefined, { loading: this.loading });
    this.quarterlyGoalStore.load([], {});
    this.hashtagStore.load([], {});
  }
}
