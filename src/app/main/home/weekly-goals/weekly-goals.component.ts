import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { WeeklyGoalsItemComponent } from './weekly-goals-item/weekly-goals-item.component';
import { Timestamp } from '@angular/fire/firestore';
import { WeeklyGoalData } from '../home.model';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    WeeklyGoalsItemComponent
  ],
})
export class WeeklyGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly dialog = inject(MatDialog);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  readonly hashtagStore = inject(HashtagStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  sampleData: WeeklyGoalData = {
    __id: 'wg1',
    __userId: 'test-user',
    __quarterlyGoalId: 'qg1',
    __hashtagId: 'ht1',
    text: 'Apply to Microsoft',
    completed: false,
    order: 1,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht1',
      __userId: 'test-user',
      name: 'apply-internships',
      color: '#2DBDB1',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
  };

  
  // --------------- COMPUTED DATA -----------------------


  // --------------- EVENT HANDLING ----------------------
  
  completion = "incomplete";
  checkGoal(newCheckState: boolean) {
    if( newCheckState === true){
        this.completion = "incomplete"
    } else {
        this.completion = "complete"
    }
    this.snackBar.open(
      'Clicked on checkbox to change state to: ' + this.completion,
      '',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },
    );
  }


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

  constructor(private snackBar: MatSnackBar) {}

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    this.weeklyGoalStore.load([], {}, undefined, { loading: this.loading });
    this.quarterlyGoalStore.load([], {});
    this.hashtagStore.load([], {});
  }
}
