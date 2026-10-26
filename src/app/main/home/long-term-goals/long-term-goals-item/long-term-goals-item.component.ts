import { Component, ChangeDetectionStrategy, input, inject, WritableSignal, Signal, signal, Inject, Injector } from '@angular/core';
import { LongTermGoalsItemAnimations } from './long-term-goals-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { LongTermGoal } from '../../../../core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-long-term-goals-item',
  templateUrl: './long-term-goals-item.component.html',
  styleUrls: ['./long-term-goals-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsItemAnimations,
  standalone: true,
  imports: [
  ],
})
export class LongTermGoalsItemComponent {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** Header text for the goal. */
  goalHeader = input<string>();

  /** Caption for the goal. */
  goalText = input<string>();

  /** User's Long Term Goal */
  goal = input<LongTermGoal>();

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
}