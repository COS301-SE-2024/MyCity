import { render } from '@testing-library/react';
import About from '@/app/about/page';
import '@testing-library/jest-dom';

describe('About Page', () => {
  // Simple test to check if the About component renders successfully
  test('should render the About page without crashing', () => {
    render(<About />);
  });
});

