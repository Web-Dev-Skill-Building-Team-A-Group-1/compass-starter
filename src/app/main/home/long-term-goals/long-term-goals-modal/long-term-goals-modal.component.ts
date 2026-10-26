import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, inject,
WritableSignal, Signal, signal } from '@angular/core';
import { LongTermGoalsModalAnimations } from './long-term-goals-modal.animations';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { LongTermGoal } from '../../../../core/store/long-term-goal/long-term-goal.model';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { LongTermGoalStore } from '../../../../core/store/long-term-goal/long-term-goal.store';

@Component({
  selector: 'app-long-term-goals-modal',
  templateUrl: './long-term-goals-modal.component.html',
  styleUrls: ['./long-term-goals-modal.component.scss'],
  animations: LongTermGoalsModalAnimations,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatOption,
    MatInput,
    MatDialogClose,
  ],
})
export class LongTermGoalsModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  /* Injects long-term goal store as a read-only dependency */
  readonly longTermGoalStore = inject(LongTermGoalStore);
  
  /* Injects the FormBuilder service as an immutable reference */
  readonly fb = inject(FormBuilder);

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  /*Normalizes white space to a single space and removes trailing spaces*/
  noWhitespaceValidator: ValidatorFn = (control): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string') {
      return null;
    }

    return value.trim().length === 0 ?
      { whitespace: true } :
      null;
  };

  // --------------- COMPUTED DATA -----------------------

  /* Validates input for long-term goals */
  longTermGoalsForm = this.fb.group({
    oneYear: ['', [Validators.required, this.noWhitespaceValidator]],
    fiveYear: ['', [Validators.required, this.noWhitespaceValidator]],
  });

  // --------------- EVENT HANDLING ----------------------

  async saveGoals() {

    /* Current values entered into form */
    const formValue = this.longTermGoalsForm.getRawValue();

    /* User's existing long-term goal */
    const existingGoal = this.data.LongTermGoal;

    /* Updates long term goals based on user input */
    if (this.longTermGoalsForm.invalid) {
      this.longTermGoalsForm.markAllAsTouched();
      return;
    }

  try {
    this.loading.set(true);

    if (existingGoal) {
      await this.longTermGoalStore.update(
        existingGoal.__id,
        {
          oneYear: formValue.oneYear ?? '',
          fiveYear: formValue.fiveYear ?? '',
        },
      );
    } else {
      await this.longTermGoalStore.add({
        __userId: this.data.userId,
        oneYear: formValue.oneYear ?? '',
        fiveYear: formValue.fiveYear ?? '',
      });
    }

    this.dialogRef.close(true);

  } catch (error) {
    console.error('Failed to save long-term goals:', error);
  } finally {
    this.loading.set(false);
  }
}

  // --------------- OTHER -------------------------------

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      LongTermGoal: LongTermGoal;
      userId: string;
    },
    public dialogRef: MatDialogRef<LongTermGoalsModalComponent>,
  ) {}

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    /*
     * The parent sends existing goals into the dialog.
     *
     * Because LongTermGoal model represents the
     * 1-year and 5-year goals in ONE document, we only
     * need the first existing document.
     */

    const existingGoal = this.data.LongTermGoal;

    if (existingGoal) {
      this.longTermGoalsForm.patchValue({
        oneYear: existingGoal.oneYear ?? '',
        fiveYear: existingGoal.fiveYear ?? '',
      });
    }
  }
}