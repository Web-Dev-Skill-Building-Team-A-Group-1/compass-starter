import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  WritableSignal,
  Signal,
  signal,
  Inject,
  Injector,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LongTermGoalsHeaderAnimations } from './long-term-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import {
  BatchWriteService,
  BATCH_WRITE_SERVICE,
} from 'src/app/core/store/batch-write.service';

@Component({
  selector: 'app-long-term-goals-header',
  templateUrl: './long-term-goals-header.component.html',
  styleUrls: ['./long-term-goals-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsHeaderAnimations,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class LongTermGoalsHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private snackBar = inject(MatSnackBar);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- EVENT HANDLING ----------------------

  onEditLongTermGoals(): void {
    this.snackBar.open('Edit long-term goals clicked', 'Close', {
      duration: 3000,
    });
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {}

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {}
}