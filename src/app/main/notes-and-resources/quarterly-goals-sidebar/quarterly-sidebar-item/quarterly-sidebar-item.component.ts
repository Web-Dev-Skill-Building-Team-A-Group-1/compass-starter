import { Component, OnInit, ChangeDetectionStrategy, input, output, Output, inject, WritableSignal, Signal, signal, computed, Inject, Injector, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuarterlySidebarItemAnimations } from './quarterly-sidebar-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-quarterly-sidebar-item',
  templateUrl: './quarterly-sidebar-item.component.html',
  styleUrls: ['./quarterly-sidebar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlySidebarItemAnimations,
  standalone: true,
  imports: [QuarterlySidebarItemAnimations, 
            MatCheckboxModule, 
            MatInputModule],
})
export class QuarterlySidebarItemComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS -----------------
  /** Input quarterly goal text (after weekly goal is added) */
  goalText = input<string>();
  
  /** The current signed-in user. */
  currentUser: Signal<User> = this.authStore.user;

  initialCompleted = input<boolean>(false);
  
  /** If the user checks a task */
  isCompleted = signal(this.initialCompleted());

  /** Assesses whether a change was made to the checkbox state */
  goalStatusChange = output<boolean>();

  /** Updates completion value when the checkbox is checked */
  onCheckboxChange(event: any): void {
    const checked = event.checked;
    this.isCompleted.set(checked);
    
    console.log(`Checkbox for goal '${this.goalText()}' changed to: ${checked}`);
    this.goalStatusChange.emit(checked);

  }

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  /** when the user adds a goal, create a new quarterly goal */
  addGoal() {
    const quarterlyGoalId = this.route.snapshot.paramMap.get('quarterlyGoalId');
    const hashtagId = this.route.snapshot.paramMap.get('hashtagId');
    console.log(quarterlyGoalId)
    console.log(hashtagId)
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
    private route: ActivatedRoute,
  ) { }

  // --------------- LOAD AND CLEANUP -------------------  
  ngOnInit(): void {
  }
}
