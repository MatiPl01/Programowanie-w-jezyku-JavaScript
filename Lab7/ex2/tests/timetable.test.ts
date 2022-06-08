import { Timetable, Action } from '../src/script';
import { expect } from 'chai';
import { describe } from 'mocha';


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

  // perform
  describe('perform', () => {
    // TODO
  });

  // canBeTransferredTo
  describe('canBeTransferredTo', () => {
    // TODO
  });
});
