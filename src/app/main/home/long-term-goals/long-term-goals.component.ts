import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { LongTermGoalsAnimations } from './long-term-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatDialog } from '@angular/material/dialog';
import { LongTermGoalsHeaderComponent } from './long-term-goals-header/long-term-goals-header.component';
import { LongTermGoalsModalComponent} from './long-term-goals-modal/long-term-goals-modal.component';
import { LongTermGoalStore } from '../../../core/store/long-term-goal/long-term-goal.store';

@Component({
  selector: 'app-long-term-goals',
  templateUrl: './long-term-goals.component.html',
  styleUrls: ['./long-term-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsAnimations,
  standalone: true,
  imports: [ LongTermGoalsHeaderComponent
  ],
})
export class LongTermGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly dialog = inject(MatDialog);
  readonly longTermGoalStore = inject(LongTermGoalStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  

  // --------------- COMPUTED DATA -----------------------

  longTermGoal = computed(() =>
    this.longTermGoalStore.selectFirst(
      [['__userId', '==', this.currentUser().__id]],
      {},
    ),
  );
  // --------------- EVENT HANDLING ----------------------
  openGoalsModal() {
    const userId = this.currentUser().__id;
  
    const incompleteGoals = this.longTermGoalStore.selectEntities(
      [['__userId', '==', userId]],
      {},
    );
  
    this.dialog.open(LongTermGoalsModalComponent, {
      width: '600px',
      position: {
        bottom: '0',
      },
      data: {
        incompleteGoals,
        userId,
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
    this.longTermGoalStore.load(
      [['__userId', '==', this.currentUser().__id]],
      {},
      undefined,
      { },
    );
  }
}


