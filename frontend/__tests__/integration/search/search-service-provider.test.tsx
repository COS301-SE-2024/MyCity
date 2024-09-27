import React from 'react';
import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchServiceProviderPage from "@/app/search/service-provider/page";
import * as SearchService from "../../../src/services/search.service";

describe('Search Service Provider Page', () => {

  // 1. Test if the page renders correctly
  test('should render the search service provider page', () => {
    render(<SearchServiceProviderPage />);

    const textboxes = screen.getAllByRole('textbox');
    const textbox = textboxes[0];
    expect(textbox).toBeInTheDocument();

    const buttons = screen.getAllByRole('button', { name: /search/i });
    const button = buttons[0];
    expect(button).toBeInTheDocument(); // Checking for a button labeled "Search"
  });

});
