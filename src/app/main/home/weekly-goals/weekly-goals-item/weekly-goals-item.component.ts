import { Component, OnInit, OutputEmitterRef, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsItemAnimations } from './weekly-goals-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WeeklyGoalData } from '../../home.model';


@Component({
  selector: 'app-weekly-goals-item',
  templateUrl: './weekly-goals-item.component.html',
  styleUrls: ['./weekly-goals-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsItemAnimations,
  standalone: true,
  imports: [MatCheckbox, MatProgressSpinner,],
})
export class WeeklyGoalsItemComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------
  
  goal: Signal<WeeklyGoalData> = input<WeeklyGoalData>();
  check: OutputEmitterRef<WeeklyGoalData> = output<WeeklyGoalData>();
  
  // --------------- LOCAL UI STATE ----------------------
  
  // --------------- COMPUTED DATA -----------------------

  isChecked: Signal<boolean> = computed(() => this.goal()?.completed ?? false);
  
  // --------------- EVENT HANDLING ----------------------
  checkGoal() {
    this.check.emit(this.goal());
  }

  // --------------- OTHER -------------------------------
  constructor(private snackBar: MatSnackBar) {}
  

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {}
}

