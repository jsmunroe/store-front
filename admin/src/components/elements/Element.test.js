import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { createElement } from '../../models/createElement';

import Element from './Element';

jest.mock('../Modal', () => ({
    useModal: () => ({
        show: (content, state) => Promise.resolve(state),
        hide: () => {},
    })
}));

describe('<Element />', () => {
    it('Component renders without errors', () => {
        const element = createElement("text", { top: 0, left: 0, width: 5, height: 5 });

        const wrapper = shallow(<Element element={element} store={store} />);
        
        expect(wrapper.find('Element').length).toBe(1);
    });
});
