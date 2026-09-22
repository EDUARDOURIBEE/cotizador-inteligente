import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the steel quote calculator', () => {
  render(<App />);
  expect(screen.getByText(/Construye con precisión/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /confirmar por whatsapp/i })).toBeInTheDocument();
});
