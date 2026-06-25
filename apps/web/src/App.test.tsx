import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

test('renders App and redirects to login when unauthenticated', () => {
  render(<App />);
  const loginHeading = screen.getByRole('heading', { name: /login to flowboard/i });
  expect(loginHeading).toBeInTheDocument();
});
