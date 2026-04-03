import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  render(<App />);
  const title = screen.getByText(/Blockchain Voting System/i);
  expect(title).toBeInTheDocument();
});

test('shows connect wallet button when no wallet is connected', () => {
  render(<App />);
  const button = screen.getByText(/Connect Wallet/i);
  expect(button).toBeInTheDocument();
});

test('does not show admin panel before wallet connection', () => {
  render(<App />);
  const adminPanel = screen.queryByText(/Admin Panel/i);
  expect(adminPanel).not.toBeInTheDocument();
});

test('shows live results section', () => {
  render(<App />);
  const results = screen.getByText(/Live Results/i);
  expect(results).toBeInTheDocument();
});
