import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { JSDOM } from 'jsdom';

import App from '../../src/components/containers/App/App';

Enzyme.configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.window = window;

describe('Component <App />', () => {
  it('should renders correctly with touch device', () => {
    const app = shallow(
      <App
        isTouchDevice
      />);
    expect(app).toMatchSnapshot();
    expect(app.find('.wrapper').hasClass('touch-device')).toEqual(true);
  });
  it('should renders correctly with is not touch device', () => {
    const app = shallow(
      <App
        testProps="testProps"
      />);
    expect(app).toMatchSnapshot();
    expect(app.find('.wrapper').hasClass('is-not-touch-device')).toEqual(true);
  });
  it('should renders correctly with context', () => {
    global.ontouchstart = window.ontouchstart;
    const app = shallow(
      <App
        testProps="testProps"
      />);
    expect(app).toMatchSnapshot();
    expect(app.find('.wrapper').hasClass('touch-device')).toEqual(true);
  });
});
