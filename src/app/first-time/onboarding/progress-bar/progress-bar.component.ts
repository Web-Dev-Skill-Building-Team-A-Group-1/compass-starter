import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * Presentational, display-only progress indicator for the onboarding flow.
 * Renders one marker per label in `steps`, filling markers up through
 * `currentStepIndex`. Shows labeled markers on desktop and unlabeled dots
 * (with the labels still present for screen readers) on mobile.
 */
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class ProgressBarComponent {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** Labels for each progress marker, in order. May contain duplicate labels. */
  steps = input.required<string[]>();

  /** 0-based index of the currently active marker. */
  currentStepIndex = input.required<number>();
}
