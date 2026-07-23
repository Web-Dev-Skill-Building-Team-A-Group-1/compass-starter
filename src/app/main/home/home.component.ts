import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { HomeAnimations } from './home.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { WeeklyGoalsHeaderComponent } from './weekly-goals/weekly-goals-header/weekly-goals-header.component';
import { LongTermGoalsComponent } from './long-term-goals/long-term-goals.component';
// TODO: Replace weekly goals header component in this file with weekly goals component!
import { QuarterlyGoalsComponent } from './quarterly-goals/quarterly-goals.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: HomeAnimations,
  imports: [
    NavbarComponent, WeeklyGoalsHeaderComponent,
    LongTermGoalsComponent, QuarterlyGoalsComponent
  ]
})
export class HomeComponent implements OnInit {
  authStore = inject(AuthStore);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  
  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit() {
  }
}


