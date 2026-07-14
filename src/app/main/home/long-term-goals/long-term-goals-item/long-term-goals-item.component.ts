import { Component, OnInit, ChangeDetectionStrategy, input, inject, WritableSignal, Signal, signal, Inject, Injector } from '@angular/core';
import { LongTermGoalsItemAnimations } from './long-term-goals-item.animations';
import { User } from 'src/app/core/store/user/user.model';

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
export class LongTermGoalsItemComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------
  
  /** Header text for the goal. */
  goalHeader = input<string>(); 
  /** Caption for the goal. */
  goalText = input<string>();
  

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
