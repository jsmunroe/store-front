import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import App from './App';

describe('<App />', () => {
  it('Component renders without errors', () => {
      const wrapper = shallow(<App />)
  });
});
