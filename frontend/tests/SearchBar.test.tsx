import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// We need to intercept navigate; wrap SearchBar in a router and check URL changes
// by asserting the navigate mock
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import SearchBar from '../src/components/SearchBar/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderBar = (defaultValue?: string) =>
    render(
      <MemoryRouter>
        <SearchBar defaultValue={defaultValue} />
      </MemoryRouter>
    );

  it('renders input and search button', () => {
    renderBar();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('pre-fills input with defaultValue', () => {
    renderBar('shoes');
    expect(screen.getByRole('searchbox')).toHaveValue('shoes');
  });

  it('navigates to /search?q=... on submit', async () => {
    const user = userEvent.setup();
    renderBar();
    await user.type(screen.getByRole('searchbox'), 'jacket');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=jacket');
  });

  it('does not navigate when input is empty', async () => {
    const user = userEvent.setup();
    renderBar();
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
