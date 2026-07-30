import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlyGoal } from '../../../../core/store/quarterly-goal/quarterly-goal.model';
import { Hashtag } from '../../../../core/store/hashtag/hashtag.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';

@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [
    MatIconButton,
    MatDialogClose,
    MatIcon,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    NgFor,
  ],
})
export class WeeklyGoalsModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  /** Rejects empty/whitespace-only text so "   " doesn't pass as a valid goal name. */
  private static readonly nonWhitespace: ValidatorFn = Validators.pattern(/\S/);

  /** FormControls for editing past goals and adding a new one. Rows are populated in the constructor. */
  weeklyGoalsForm = this.fb.group({
    allGoals: this.fb.array([]),
  });

  /** Getter for the form array with a type that allows use of controls. */
  get allGoals() {
    return this.weeklyGoalsForm.get('allGoals') as FormArray;
  }

  // --------------- COMPUTED DATA -----------------------

  endOfWeek = endOfWeek; // import from time.utils.ts

  startOfWeek = startOfWeek; // import from time.utils.ts

  /**
   * Get the count of newly added goals that are not marked for deletion.
   * A goal is considered newly added if its `_new` flag is true.
   */
  get addedGoalsCount() {
    // Filter the goals to find those that are newly added (_new is true) and not marked as deleted (_deleted is false)
    return this.allGoals.controls.filter(
      (goal) => goal.value._new && !goal.value._deleted,
    ).length;
  }

  /**
   * Calculates the number of edited goals.
   * Only counts goals that are dirty (edited), have different text from original,
   * are not newly added (_new is false), and are not marked as deleted (_deleted is false).
   */
  get editedGoalsCount() {
    return this.allGoals.controls.filter(
      (goal) =>
        goal.dirty && // Check if the goal has been edited
        (goal.value.text !== goal.value.originalText || // Compare current text with original text
          goal.value.__hashtagId !== goal.value.originalHashtagId) && // ...or compare current hashtag with original hashtag
        !goal.value._new && // Ensure the goal is not newly added
        !goal.value._deleted, // Ensure the goal is not marked for deletion
    ).length;
  }

  /** Look up a hashtag's color by id, for coloring the select trigger to match the chosen hashtag. */
  hashtagColor(hashtagId: string): string {
    return this.data.hashtags.find((hashtag) => hashtag.__id === hashtagId)?.color ?? '';
  }

  /**
   * Get the count of goals that are marked for deletion.
   * A goal is considered marked for deletion if its `_deleted` flag is true.
   */
  get deletedGoalsCount() {
    // Filter the goals to find those that are marked as deleted (_deleted is true)
    return this.allGoals.controls.filter((goal) => goal.value._deleted).length;
  }

  // --------------- EVENT HANDLING ----------------------

  /** Add a goal to the form. Pass an existing WeeklyGoal to seed a row, or null for a blank one. */
  addGoalToForm(goal: WeeklyGoal) {
    if (goal) {
      this.allGoals.push(
        this.fb.group({
          text: [goal.text, [Validators.required, WeeklyGoalsModalComponent.nonWhitespace]],
          originalText: [goal.text],
          originalOrder: [goal.order],
          originalHashtagId: [goal.__hashtagId],
          originalQuarterlyGoalId: [goal.__quarterlyGoalId],
          __weeklyGoalId: [goal.__id],
          __hashtagId: [goal.__hashtagId, Validators.required],
          __quarterlyGoalId: [goal.__quarterlyGoalId],
          _deleted: [goal._deleted ?? false],
          _new: [false],
        }),
      );
    } else {
      this.allGoals.push(
        this.fb.group({
          text: ['', [Validators.required, WeeklyGoalsModalComponent.nonWhitespace]],
          __hashtagId: ['', Validators.required],
          _deleted: [false],
          _new: [true],
        }),
      );
    }
  }

  /** Support drag and drop of goals. */
  drop(event: CdkDragDrop<WeeklyGoal[]>) {
    moveItemInArray(
      this.allGoals.controls,
      event.previousIndex,
      event.currentIndex,
    );
  }

  fullDelete(e, i) {
    if (
      e.target.checked &&
      this.weeklyGoalsForm.get(['allGoals', i, '_new']).value
    ) {
      this.allGoals.removeAt(i);
    }
  }

  async saveGoals() {
    // Logic will run callback in next step
  }

  // --------------- OTHER -------------------------------

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      goalDatas: Partial<QuarterlyGoal>[];
      incompleteGoals: WeeklyGoal[];
      hashtags: Hashtag[];
      openWithEmptyRow: boolean;
    },
    public dialogRef: MatDialogRef<WeeklyGoalsModalComponent>,
    private fb: FormBuilder,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {
    // Initialize allGoals with the set of incompleteGoals
    this.data.incompleteGoals.forEach((goal) => this.addGoalToForm(goal));

    if (this.data.incompleteGoals.length === 0 || this.data.openWithEmptyRow) {
      this.addGoalToForm(null);
    }
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void { }
}

