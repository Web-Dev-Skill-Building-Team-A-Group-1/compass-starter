import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { InitialPageAnimations } from './initial-page.animations';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

/**
 * Presentational Welcome card shown as the first step of onboarding
 * (`OnboardingState.WELCOME`). Purely driven by inputs — the parent
 * (`OnboardingComponent`) supplies the greeting name and loading state,
 * and owns what happens once the user clicks "Next".
 */
@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: InitialPageAnimations,
  standalone: true,
  imports: [MatButton, MatIcon],
})
export class InitialPageComponent {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** First name to greet, already split from the full name by the parent. */
  firstName = input.required<string>();

  /** Whether the Next button should show a disabled/loading state. */
  loading = input<boolean>(false);

  /** Emitted when the user clicks the Next button. */
  next = output<void>();

  // --------------- COMPUTED DATA -----------------------

  /** Full greeting text, falling back to a plain "Welcome." when no name is available. */
  greeting = computed(() => this.firstName() ? `Welcome, ${this.firstName()}.` : 'Welcome.');

  // --------------- EVENT HANDLING ----------------------

  /** Called when the user clicks the Next button. */
  onNext(): void {
    this.next.emit();
  }
}
