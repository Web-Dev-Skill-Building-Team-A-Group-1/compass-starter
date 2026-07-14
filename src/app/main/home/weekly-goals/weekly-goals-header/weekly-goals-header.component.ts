import { Component, OnInit, ChangeDetectionStrategy, inject, WritableSignal, Signal, signal, Inject, Injector } from '@angular/core';
import { WeeklyGoalsHeaderAnimations } from './weekly-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { endOfWeek, startOfWeek } from '../../../../core/utils/time.utils';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-weekly-goals-header',
  templateUrl: './weekly-goals-header.component.html',
  styleUrls: ['./weekly-goals-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsHeaderAnimations,
  standalone: true,
  imports: [],
})
  
export class WeeklyGoalsHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------
  /** Displayed Ending Date */
  endOfWeek = endOfWeek;

  /** Displayed Start Date */
  startOfWeek = startOfWeek;

  // --------------- EVENT HANDLING ----------------------
/**
  * Function to edit goals when user clicks on pencil icon
  */
  editGoals() {
    this.snackBar.open('Clicked on icon', 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
  // --------------- OTHER -------------------------------

  constructor(
    private snackBar: MatSnackBar,
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
