import React from 'react';
import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchCitizenPage from "@/app/search/citizen/page";
import * as SearchService from "../../../src/services/search.service";

describe('Search Citizen Page', () => {

  // 1. Test if the page renders correctly
  test('should render the search citizen page', () => {
    render(<SearchCitizenPage />);

    const textboxes = screen.getAllByRole('textbox');
    const textbox = textboxes[0];
    expect(textbox).toBeInTheDocument();

    const buttons = screen.getAllByRole('button', { name: /search/i });
    const button = buttons[0];
    expect(button).toBeInTheDocument(); // Checking for a button labeled "Search"
  });

});
