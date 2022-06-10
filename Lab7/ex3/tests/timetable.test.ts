import { expect } from 'chai';
import { describe } from 'mocha';
import Timetable from '../src/classes/timetable';
import Action from '../src/enums/action.enum';
import Meeting from '../src/types/meeting.type';


describe('Timetable', () => {
  // put
  describe('put', () => {
    it('should add meetings to the timetable', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];

      meetings.forEach(meeting => {
        expect(timetable.put(meeting)).to.be.true;
      });
    });

    it('should not add meetings to the timetable', () => {
      const timetable = new Timetable();
      const meeting1 = {
        title: '',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
      };
      const meeting2 = {  // Ends when meeting1 takes place
        title: '',
        date: new Date('2022-07-31 08:00:01'),
        duration: 1,
        participants: []
      };
      const meeting3 = {  // Starts when meeting1 still takes place
        title: '',
        date: new Date('2022-07-31 10:59:59'),
        duration: 1,
        participants: []
      };

      expect(timetable.put(meeting1)).to.be.true;
      expect(timetable.put(meeting2)).to.be.false;
      expect(timetable.put(meeting3)).to.be.false;
    });
  });


  // busy
  describe('busy', () => {
    it('should indicate that the term is busy', () => {
      const timetable = new Timetable();
      const meeting = {
        title: '',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
      };
      timetable.put(meeting);

      expect(timetable.busy(new Date('2022-07-31 09:00:00'))).to.be.true;
      expect(timetable.busy(new Date('2022-07-31 10:59:59'))).to.be.true;
    });

    it('should indicate that the term is not busy', () => {
      const timetable = new Timetable();
      const meeting = {
        title: '',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
      };
      timetable.put(meeting);

      expect(timetable.busy(new Date('2022-07-31 08:59:59'))).to.be.false;
      expect(timetable.busy(new Date('2022-07-31 11:00:00'))).to.be.false;
    });
  });

  // get
  describe('get', () => {
    it('should return a meeting that takes place at the specific time', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];
      meetings.forEach(timetable.put.bind(timetable));

      meetings.forEach(meeting => {
        expect(timetable.get(meeting.date)).to.equal(meeting);
      });

      expect(timetable.get(new Date('2022-07-31 10:00:00'))).to.equal(meetings[0]);
      expect(timetable.get(new Date('2022-07-31 12:00:00'))).to.equal(meetings[1]);
      expect(timetable.get(new Date('2022-07-31 08:30:00'))).to.equal(meetings[2]);

      meetings.forEach(meeting => {
        const lastSecondDate = new Date(meeting.date);
        lastSecondDate.setHours(meeting.date.getHours() + meeting.duration - 1);
        lastSecondDate.setMinutes(meeting.date.getMinutes() + 59);
        lastSecondDate.setSeconds(meeting.date.getSeconds() + 59);
        expect(timetable.get(lastSecondDate)).to.equal(meeting);
      });
    });

    it('should return not return any meeting', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 1,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];
      meetings.forEach(timetable.put.bind(timetable));

      expect(timetable.get(new Date('2022-07-31 07:59:59'))).to.be.null;
      expect(timetable.get(new Date('2022-07-31 13:00:00'))).to.be.null;
      expect(timetable.get(new Date('2022-07-31 10:00:00'))).to.be.null;
      expect(timetable.get(new Date('2022-07-31 10:59:59'))).to.be.null;
    });
  });

  // canBeTransferredTo
  describe('canBeTransferredTo', () => {
    it('should indicate that the meetings cannot be transferred', () => {
      const timetable = new Timetable();
      const meeting1 = {
        title: '',
        date: new Date('2022-07-31 08:00:00'),
        duration: 1,
        participants: []
      };
      const meeting2 = {
        title: '',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
      };
      const meeting3 = {
        title: '',
        date: new Date('2022-07-31 11:00:00'),
        duration: 2,
        participants: []
      };

      timetable.put(meeting1);
      timetable.put(meeting2);
      timetable.put(meeting3);

      expect(timetable.canBeTransferredTo(meeting1, new Date('2022-07-31 07:59:59'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting1, new Date('2022-07-31 08:00:01'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting1, new Date('2022-07-31 19:00:01'))).to.be.false;

      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 07:59:59'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 08:59:59'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 09:00:01'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 18:00:01'))).to.be.false;

      expect(timetable.canBeTransferredTo(meeting3, new Date('2022-07-31 07:59:59'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting3, new Date('2022-07-31 10:59:59'))).to.be.false;
      expect(timetable.canBeTransferredTo(meeting3, new Date('2022-07-31 18:00:01'))).to.be.false;
    });

    it('should indicate that the meetings can be transferred', () => {
      const timetable = new Timetable();
      const meeting1 = {
        title: 'Meeting 1',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
      };
      const meeting2 = {
        title: 'Meeting 2',
        date: new Date('2022-07-31 11:00:00'),
        duration: 2,
        participants: []
      };
      const meeting3 = {
        title: 'Meeting 3',
        date: new Date('2022-07-31 08:00:00'),
        duration: 1,
        participants: []
      };

      timetable.put(meeting1);
      timetable.put(meeting2);
      timetable.put(meeting3);

      expect(timetable.canBeTransferredTo(meeting1, new Date('2022-07-31 13:00:00'))).to.be.true;
      expect(timetable.canBeTransferredTo(meeting1, new Date('2022-07-31 18:00:00'))).to.be.true;
      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 12:00:00'))).to.be.true;
      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 13:00:00'))).to.be.true;
      expect(timetable.canBeTransferredTo(meeting2, new Date('2022-07-31 18:00:00'))).to.be.true;
      expect(timetable.canBeTransferredTo(meeting3, new Date('2022-07-31 13:00:00'))).to.be.true;
      expect(timetable.canBeTransferredTo(meeting3, new Date('2022-07-31 19:00:00'))).to.be.true;
    });
  });

  // perform
  describe('perform', () => {
    it('should change meetings date to the next day', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 1,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];
      meetings.forEach(timetable.put.bind(timetable));

      const sortedMeetings: Meeting[] = [];
      meetings.forEach(meeting => {
        const meetingCopy = { ...meeting };
        meetingCopy.date = new Date(meeting.date);
        sortedMeetings.push(meetingCopy);
      });
      sortedMeetings.sort((m1, m2) => {
        if (m1.date > m2.date) return 1;
        if (m1.date < m2.date) return -1;
        return 0;
      });

      expect(() => timetable.perform([Action.DAY_LATER, Action.DAY_LATER, Action.DAY_LATER])).not.to.throw();

      const nextMeetings = timetable.getNextMeetings(meetings.length);
      expect(nextMeetings.length).to.equal(meetings.length);
      nextMeetings.forEach((meeting, i) => {
        const date = new Date(meeting.date);
        date.setDate(date.getDate() - 1);
        expect(date.toISOString()).to.equal(sortedMeetings[i].date.toISOString());
      });
    });

    it('should change meetings date to the previous day', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 1,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];
      meetings.forEach(timetable.put.bind(timetable));

      const sortedMeetings: Meeting[] = [];
      meetings.forEach(meeting => {
        const meetingCopy = { ...meeting };
        meetingCopy.date = new Date(meeting.date);
        sortedMeetings.push(meetingCopy);
      });
      sortedMeetings.sort((m1, m2) => {
        if (m1.date > m2.date) return 1;
        if (m1.date < m2.date) return -1;
        return 0;
      });

      expect(() => timetable.perform([Action.DAY_EARLIER, Action.DAY_EARLIER, Action.DAY_EARLIER])).not.to.throw();

      const nextMeetings = timetable.getNextMeetings(meetings.length);
      expect(nextMeetings.length).to.equal(meetings.length);
      nextMeetings.forEach((meeting, i) => {
        const date = new Date(meeting.date);
        date.setDate(date.getDate() + 1);
        expect(date.toISOString()).to.equal(sortedMeetings[i].date.toISOString());
      });
    });

    it('should increment meetings hour', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 1,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];
      meetings.forEach(timetable.put.bind(timetable));

      const sortedMeetings: Meeting[] = [];
      meetings.forEach(meeting => {
        const meetingCopy = { ...meeting };
        meetingCopy.date = new Date(meeting.date);
        sortedMeetings.push(meetingCopy);
      });
      sortedMeetings.sort((m1, m2) => {
        if (m1.date > m2.date) return 1;
        if (m1.date < m2.date) return -1;
        return 0;
      });

      expect(() => timetable.perform([Action.HOUR_LATER, Action.HOUR_LATER, Action.HOUR_LATER])).not.to.throw();

      const nextMeetings = timetable.getNextMeetings(meetings.length);
      expect(nextMeetings.length).to.equal(meetings.length);
      nextMeetings.forEach((meeting, i) => {
        const date = new Date(meeting.date);
        date.setHours(date.getHours() - 1);
        expect(date.toISOString()).to.equal(sortedMeetings[i].date.toISOString());
      });
    });

    it('should not decrement meetings hour', () => {
      const timetable = new Timetable();
      const meetings = [
        {
          title: '',
          date: new Date('2022-07-31 09:00:00'),
          duration: 1,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 11:00:00'),
          duration: 2,
          participants: []
        },
        {
          title: '',
          date: new Date('2022-07-31 08:00:00'),
          duration: 1,
          participants: []
        }
      ];
      meetings.forEach(timetable.put.bind(timetable));

      const sortedMeetings: Meeting[] = [];
      meetings.forEach(meeting => {
        const meetingCopy = { ...meeting };
        meetingCopy.date = new Date(meeting.date);
        sortedMeetings.push(meetingCopy);
      });
      sortedMeetings.sort((m1, m2) => {
        if (m1.date > m2.date) return 1;
        if (m1.date < m2.date) return -1;
        return 0;
      });

      expect(() => timetable.perform([Action.HOUR_EARLIER, Action.HOUR_EARLIER, Action.HOUR_EARLIER])).to.throw('Could not move the specified meetings');

      // Check if meetings were unchanged
      const nextMeetings = timetable.getNextMeetings(meetings.length);
      expect(nextMeetings.length).to.equal(meetings.length);
      nextMeetings.forEach((meeting, idx) => {
        expect(meeting).to.deep.equal(sortedMeetings[idx]);
      });
    });

    it('should change meetings dates (mixed)', () => {
      const timetable = new Timetable();
      const meeting1 = {
        title: 'Meeting 1',
        date: new Date('2022-07-31 08:00:00'),
        duration: 1,
        participants: []
      };
      const meeting2 = {
        title: 'Meeting 2',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
      };
      const meeting3 = {
        title: 'Meeting 3',
        date: new Date('2022-07-31 11:00:00'),
        duration: 2,
        participants: []
      };

      timetable.put(meeting1);
      timetable.put(meeting2);
      timetable.put(meeting3);

      const actions = [Action.DAY_EARLIER, Action.DAY_LATER, Action.HOUR_EARLIER];
      expect(() => timetable.perform(actions)).not.to.throw();

      expect(meeting1.date.toISOString()).to.equal(new Date('2022-07-30 08:00:00').toISOString());
      expect(meeting2.date.toISOString()).to.equal(new Date('2022-08-01 09:00:00').toISOString());
      expect(meeting3.date.toISOString()).to.equal(new Date('2022-07-31 10:00:00').toISOString());

      const nextMeetings = timetable.getNextMeetings(actions.length);
      expect(nextMeetings.length).to.equal(actions.length);
      expect(nextMeetings[0]).to.equal(meeting1);
      expect(nextMeetings[1]).to.equal(meeting3);
      expect(nextMeetings[2]).to.equal(meeting2);
    });
  });
});
