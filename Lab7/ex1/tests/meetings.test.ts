import { move, Action } from '../src/script';
import { expect } from 'chai';
import { describe } from 'mocha';


describe('change the meeting hour', () => {
  it('should decrease the meeting start hour', () => {
    const date = new Date('2022-07-31 09:00:00');
    const expectedDate = new Date('2022-07-31 08:00:00');

    const meeting = {
      title: 'Meeting',
      date,
      duration: 1,
      participants: []
    };

    expect(move(meeting, Action.HOUR_EARLIER).date.toISOString()).to.equal(expectedDate.toISOString());
  });

  it('should not decrease the meeting start hour', () => {
    const date = new Date('2022-07-31 08:59:59');

    const meeting = {
      title: 'Meeting',
      date,
      duration: 1,
      participants: []
    };

    expect(() => move(meeting, Action.HOUR_EARLIER)).to.throw('Meeting cannot start before 8:00')
  });

  it('should increase the meeting start hour', () => {
    const date = new Date('2022-07-31 16:59:59');
    const expectedDate = new Date('2022-07-31 17:59:59');  // Ends at 19:59:59

    const meeting = {
      title: 'Meeting',
      date,
      duration: 2,
      participants: []
    };

    expect(move(meeting, Action.HOUR_LATER).date.toISOString()).to.equal(expectedDate.toISOString());
  });

  it('should set the meeting end hour to 20:00:00', () => {
    const date = new Date('2022-07-31 17:00:00');
    const expectedDate = new Date('2022-07-31 18:00:00'); // Ends at 20:00:00

    const meeting = {
      title: 'Meeting',
      date,
      duration: 2,
      participants: []
    };

    expect(move(meeting, Action.HOUR_LATER).date.toISOString()).to.equal(expectedDate.toISOString());
  });

  it('should not increase the meeting start hour', () => {
    const date = new Date('2022-07-31 17:00:01');

    const meeting = {
      title: 'Meeting',
      date,
      duration: 2,
      participants: []
    };

    expect(() => move(meeting, Action.HOUR_LATER)).to.throw('Meeting cannot end after 20:00')
  });
});


describe('change the meeting day', () => {
  it('should decrease the meeting start day', () => {
    const date = new Date('2023-01-01 09:00:00');
    const expectedDate = new Date('2022-12-31 09:00:00');

    const meeting = {
      title: 'Meeting',
      date,
      duration: 1,
      participants: []
    };

    expect(move(meeting, Action.DAY_EARLIER).date.toISOString()).to.equal(expectedDate.toISOString());
  });

  it('should increase the meeting start day', () => {
    const date = new Date('2022-12-31 08:59:59');
    const expectedDate = new Date('2023-01-01 08:59:59');

    const meeting = {
      title: 'Meeting',
      date,
      duration: 0,
      participants: []
    };

    expect(move(meeting, Action.DAY_LATER).date.toISOString()).to.equal(expectedDate.toISOString());
  });
});
