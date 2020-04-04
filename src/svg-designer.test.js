import React from 'react';
import { render } from '@testing-library/react';
import SvgDesigner from './svg-designer';

test('renders learn react link', () => {
  const { getByText } = render(<SvgDesigner />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
