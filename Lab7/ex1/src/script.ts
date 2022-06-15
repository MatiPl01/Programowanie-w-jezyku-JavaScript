enum Action {
  DAY_EARLIER = 'Dzień wcześniej',
  DAY_LATER = 'Dzień później',
  HOUR_EARLIER = 'Godzinę wcześniej',
  HOUR_LATER = 'Godzinę później'
};

type Meeting = {
  title: string;
  date: Date;
  duration: number;
  participants: string[]
};


const meetings: Meeting[] = [];

meetings.push({
  title: 'Meeting1',
  date: new Date('2022-07-31 09:00:00'),
  duration: 3,
  participants: [
    'Participant 1',
    'Participant 2',
    'Participant 3'
  ]
});

meetings.push({
  title: 'Meeting1',
  date: new Date('2022-07-31 08:32:13'),
  duration: 5,
  participants: [
    'Participant 1',
    'Participant 2',
    'Participant 3'
  ]
});

meetings.push({
  title: 'Meeting1',
  date: new Date('2022-07-05 18:00:01'),
  duration: 1,
  participants: [
    'Participant 1',
    'Participant 2',
  ]
});

meetings.push({
  title: 'Meeting1',
  date: new Date('2023-02-01 18:00:00'),
  duration: 1,
  participants: [
    'Participant 1',
    'Participant 2',
    'Participant 3',
    'Participant 4'
  ]
});


const actions: Action[] = [];

actions.push(Action.DAY_EARLIER);
actions.push(Action.DAY_LATER);
actions.push(Action.HOUR_LATER);


let move: (meeting: Meeting, action: Action) => Meeting;
move = (meeting, action) => {
  const result = { ...meeting, date: new Date(meeting.date) };

  switch (action) {
    case Action.DAY_EARLIER:
      result.date.setDate(meeting.date.getDate() - 1);
      break;
    case Action.DAY_LATER:
      result.date.setDate(meeting.date.getDate() + 1);
      break;
    case Action.HOUR_EARLIER:
      if (meeting.date.getHours() < 9) {
        throw new Error('Meeting cannot start before 8:00');
      }
      result.date.setHours(meeting.date.getHours() - 1);
      break;
    case Action.HOUR_LATER:
      const newHour = meeting.date.getHours() + 1;
      if (newHour + meeting.duration > 20 || 
          newHour + meeting.duration === 20 && (meeting.date.getMinutes() > 0 || meeting.date.getSeconds() > 0)) {
          throw new Error('Meeting cannot end after 20:00');
        }
      result.date.setHours(newHour);
  }

  return result;
};

// Tests
// 1 day earlier
console.log('1 day earlier');
meetings.forEach(meeting => {
  const oldDate = meeting.date.toLocaleDateString();
  const newDate = move(meeting, Action.DAY_EARLIER).date.toLocaleDateString();
  console.log(`${oldDate} -> ${newDate}`);
});

// 1 day later
console.log('\n1 day later');
meetings.forEach(meeting => {
  const oldDate = meeting.date.toLocaleDateString();
  const newDate = move(meeting, Action.DAY_LATER).date.toLocaleDateString();
  console.log(`${oldDate} -> ${newDate}`);
});

// 1 hour earlier
console.log('\n1 hour earlier');
meetings.forEach(meeting => {
  const oldDate = meeting.date.toLocaleDateString();
  try {
    const newDate = move(meeting, Action.HOUR_EARLIER).date.toLocaleDateString();
    console.log(`${oldDate} -> ${newDate}`);
  } catch (err) {
    console.error((err as Error).message);
  }
});

// 1 hour later
console.log('\n1 day later');
meetings.forEach(meeting => {
  const oldDate = meeting.date.toLocaleDateString();
  try {
    const newDate = move(meeting, Action.HOUR_LATER).date.toLocaleDateString();
    console.log(`${oldDate} -> ${newDate}`);
  } catch (err) {
    console.error((err as Error).message);
  }
});


export {
  move,
  Action
};
