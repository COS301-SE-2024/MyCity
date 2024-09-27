// guide.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Guide from '@/app/page';

describe('Guide Component', () => {

  test('renders the navbar', () => {
    render(<Guide />);
  });

});
