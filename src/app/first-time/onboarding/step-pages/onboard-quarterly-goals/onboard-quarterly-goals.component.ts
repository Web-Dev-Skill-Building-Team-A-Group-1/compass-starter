import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  output,
  inject,
  WritableSignal,
  Signal,
  signal,
  Inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { OnboardQuarterlyGoalsAnimations } from './onboard-quarterly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';

/** Predefined palette of distinct colors for hashtags across rows */
export const DEFAULT_HASHTAG_COLORS: string[] = [
  '#E07A5F', // Coral / Terracotta
  '#2DBDB1', // Teal
  '#F4A261', // Peach / Warm Amber
  '#457B9D', // Steel Blue
  '#A8DADC', // Soft Aqua
];

/** Interface for quarterly goal form items */
export interface QuarterlyGoalFormValue {
  text: string;
  hashtagName: string;
  hashtagColor: string;
  order: number;
}

@Component({
  selector: 'app-onboard-quarterly-goals',
  templateUrl: './onboard-quarterly-goals.component.html',
  styleUrls: ['./onboard-quarterly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: OnboardQuarterlyGoalsAnimations,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class OnboardQuarterlyGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  /** Event emitted when moving to the next onboarding step */
  next = output<QuarterlyGoalFormValue[]>();

  /** Event emitted when navigating back to the previous step */
  back = output<void>();

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon / submission state. */
  loading: WritableSignal<boolean> = signal(false);

  /** Reactive form holding the list of quarterly goals */
  goalsForm: FormGroup = this.fb.group({
    goals: this.fb.array([]),
  });

  // --------------- COMPUTED DATA -----------------------

  /** Typed accessor for the goals FormArray */
  get goalsArray(): FormArray {
    return this.goalsForm.get('goals') as FormArray;
  }

  // --------------- EVENT HANDLING ----------------------

  /**
   * Reorder goals within the list on drag-and-drop drop event.
   */
  onDrop(event: CdkDragDrop<FormGroup[]>): void {
    moveItemInArray(this.goalsArray.controls, event.previousIndex, event.currentIndex);
    // Update order property for each control
    this.goalsArray.controls.forEach((control, index) => {
      control.patchValue({ order: index }, { emitEvent: false });
    });
    this.goalsArray.markAsDirty();
  }

  /**
   * Cleans hashtag input to remove extraneous characters if pasted with #
   */
  formatHashtag(index: number): void {
    const control = this.goalsArray.at(index)?.get('hashtagName');
    if (control && control.value) {
      const sanitized = control.value.replace(/^#+/, '').trim();
      control.setValue(sanitized, { emitEvent: false });
    }
  }

  /**
   * Navigate back to previous onboarding page.
   */
  onBack(): void {
    this.back.emit();
  }

  /**
   * Validate and proceed to the next step.
   */
  onNext(): void {
    if (this.goalsForm.invalid) {
      this.goalsForm.markAllAsTouched();
      return;
    }

    const goalsData: QuarterlyGoalFormValue[] = this.goalsArray.value.map(
      (item: { text: string; hashtagName: string; hashtagColor: string; order: number }, index: number) => ({
        text: item.text.trim(),
        hashtagName: item.hashtagName.trim().replace(/^#+/, ''),
        hashtagColor: item.hashtagColor,
        order: item.order ?? index,
      })
    );

    this.next.emit(goalsData);
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    this.initDefaultGoals();
  }

  /**
   * Initializes 3 default goal entries matching the Figma mockup layout.
   */
  private initDefaultGoals(): void {
    const defaultData = [
      { text: '', hashtagName: '', color: DEFAULT_HASHTAG_COLORS[0] },
      { text: '', hashtagName: '', color: DEFAULT_HASHTAG_COLORS[1] },
      { text: '', hashtagName: '', color: DEFAULT_HASHTAG_COLORS[2] },
    ];

    defaultData.forEach((item, index) => {
      this.goalsArray.push(
        this.fb.group({
          text: [item.text, [Validators.required]],
          hashtagName: [item.hashtagName, [Validators.required]],
          hashtagColor: [item.color],
          order: [index],
        })
      );
    });
  }
}
