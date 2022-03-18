import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Busy from './Busy';

describe('<Busy />', () => {
    it('Component renders without errors', () => {
        const wrapper = shallow(<Busy />);

        expect(wrapper.length).toBe(1);        

    });
});
