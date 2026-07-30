import { Component, OnInit, ChangeDetectionStrategy, inject, output, WritableSignal, Signal, signal, Inject, Injector } from '@angular/core';
import { WeeklyGoalsHeaderAnimations } from './weekly-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { endOfWeek, startOfWeek } from '../../../../core/utils/time.utils';


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

  /** Emitted when the edit (pencil) icon is clicked, so a parent can open the Weekly Goals modal. */
  editClicked = output<void>();

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
    this.editClicked.emit();
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


