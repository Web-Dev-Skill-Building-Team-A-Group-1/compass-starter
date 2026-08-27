import { render, screen } from '@testing-library/angular';
import { ProgressBarComponent } from './progress-bar.component';

const STEPS = ['Long Term Goals', 'Quarter Goals', 'Organize', 'Weekly Goals', 'Organize'];

/**
 * Sets up the testing environment for ProgressBarComponent.
 * @param steps - Labels for each progress marker.
 * @param currentStepIndex - 0-based index of the active marker.
 */
async function setup({ steps = STEPS, currentStepIndex = 0 } = {}) {
  const view = await render(ProgressBarComponent, {
    componentInputs: { steps, currentStepIndex },
  });

  return {
    rerender: (inputs: { steps?: string[]; currentStepIndex?: number }) =>
      view.rerender({ componentInputs: inputs }),
  };
}

describe('ProgressBarComponent', () => {
  it('renders a marker per step label and marks the active one with aria-current', async () => {
    await setup({ currentStepIndex: 0 });

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).not.toHaveAttribute('aria-current');

    // Both "Organize" labels render even though the text repeats.
    expect(screen.getAllByText('Organize')).toHaveLength(2);
  });

  it('fills markers up through currentStepIndex and marks earlier ones completed for screen readers', async () => {
    await setup({ currentStepIndex: 2 });

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('progress-bar__step--filled');
    expect(items[1]).toHaveClass('progress-bar__step--filled');
    expect(items[2]).toHaveClass('progress-bar__step--filled');
    expect(items[3]).not.toHaveClass('progress-bar__step--filled');
    expect(items[4]).not.toHaveClass('progress-bar__step--filled');
    expect(items[2]).toHaveAttribute('aria-current', 'step');

    // Steps before the active one are announced as completed to screen readers...
    expect(screen.getByText('Long Term Goals').parentElement).toHaveTextContent(/completed/i);
    expect(screen.getByText('Quarter Goals').parentElement).toHaveTextContent(/completed/i);

    // ...but the active step itself and upcoming steps are not.
    expect(items[2]).not.toHaveTextContent(/completed/i);
    expect(items[3]).not.toHaveTextContent(/completed/i);
    expect(items[4]).not.toHaveTextContent(/completed/i);
  });

  it('renders correctly at the last index, with no upcoming steps left', async () => {
    await setup({ currentStepIndex: 4 });

    const items = screen.getAllByRole('listitem');
    for (const item of items) {
      expect(item).toHaveClass('progress-bar__step--filled');
    }
    expect(items[4]).toHaveAttribute('aria-current', 'step');
  });

  it('rerenders when currentStepIndex changes', async () => {
    const { rerender } = await setup({ currentStepIndex: 0 });

    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');

    await rerender({ steps: STEPS, currentStepIndex: 1 });

    const items = screen.getAllByRole('listitem');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
  });

  it('does not throw and renders no markers when steps is empty', async () => {
    await setup({ steps: [], currentStepIndex: 0 });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
