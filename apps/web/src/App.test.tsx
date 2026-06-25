import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    // Vite template has "Get started"
    expect(screen.getByText(/Get started/i)).toBeInTheDocument();
  });
});
