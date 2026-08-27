import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { InitialPageComponent } from './initial-page.component';

/**
 * Sets up the testing environment for InitialPageComponent.
 * @param firstName - The name to greet.
 * @param loading - Whether the Next button should show a loading state.
 */
async function setup({ firstName = 'Jennifer', loading = false } = {}) {
  const user = userEvent.setup();
  const nextSpy = jest.fn();

  const view = await render(InitialPageComponent, {
    componentInputs: { firstName, loading },
    on: { next: nextSpy },
  });

  return {
    user,
    nextSpy,
    rerender: (inputs: { firstName: string; loading: boolean }) =>
      view.rerender({ componentInputs: inputs }),
  };
}

describe('InitialPageComponent', () => {
  it('renders the greeting and subtext, and emits next when Next is clicked', async () => {
    const { user, nextSpy } = await setup({ firstName: 'Jennifer' });

    expect(screen.getByRole('heading', { name: 'Welcome, Jennifer.' })).toBeVisible();
    expect(screen.getByText(/Compass helps you set goals and reach them/i)).toBeVisible();

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).not.toBeDisabled();

    await user.click(nextBtn);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it('renders "Welcome." with no trailing name when firstName is empty', async () => {
    await setup({ firstName: '' });

    expect(screen.getByRole('heading', { name: 'Welcome.' })).toBeVisible();
  });

  it('rerenders the greeting when firstName changes', async () => {
    const { rerender } = await setup({ firstName: 'Jennifer' });

    expect(screen.getByRole('heading', { name: 'Welcome, Jennifer.' })).toBeVisible();

    await rerender({ firstName: 'Alex', loading: false });

    expect(screen.getByRole('heading', { name: 'Welcome, Alex.' })).toBeVisible();
  });

  it('disables the Next button and marks it aria-busy while loading', async () => {
    await setup({ loading: true });

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).toBeDisabled();
    expect(nextBtn).toHaveAttribute('aria-busy', 'true');
  });

  it('re-enables the Next button and clears aria-busy when loading changes back to false', async () => {
    const { rerender } = await setup({ loading: true });

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).toBeDisabled();

    await rerender({ firstName: 'Jennifer', loading: false });

    expect(nextBtn).not.toBeDisabled();
    expect(nextBtn).not.toHaveAttribute('aria-busy', 'true');
  });
});
