// @flow

import * as React from 'react';
import Renderer from 'react-test-renderer';

import AdaptableLayout from '../AdaptableLayout';

it('renders empty element without props', () => {
  expect(
    Renderer.create(
      <AdaptableLayout.Provider>
        <AdaptableLayout.Consumer />
      </AdaptableLayout.Provider>,
    ),
  ).toMatchSnapshot();
});

it('throw error when called without provider', () => {
  const NODE_ENV = process.env.NODE_ENV;
  process.env.NODE_ENV = 'something else than test';

  // Suppress this error:
  // Consider adding an error boundary to your tree to customize error handling behavior.
  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() =>
    Renderer.create(<AdaptableLayout.Consumer />),
  ).toThrowErrorMatchingSnapshot();

  process.env.NODE_ENV = NODE_ENV;
});