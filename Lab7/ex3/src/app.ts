import Timetable from "./classes/timetable";
import Action from "./enums/action.enum"
import parse from "./utils/parse.util"
import ps from "prompt-sync";


const prompt = ps();


const meetings = [
    {
        title: 'Meeting 1',
        date: new Date('2022-07-31 09:00:00'),
        duration: 2,
        participants: []
    },
    {
        title: 'Meeting 2',
        date: new Date('2022-07-31 11:00:00'),
        duration: 2,
        participants: []
    },
    {
        title: 'Meeting 3',
        date: new Date('2022-07-31 08:00:00'),
        duration: 1,
        participants: []
    }
];

const timetable = new Timetable();
meetings.forEach(timetable.put.bind(timetable));

console.log(`
Move the meetings:
d+ - move one day later,
d- - move one day earlier,
h+ - move one hour later,
h- - move one hour earlier`);

const moves: (string | null)[] = [];


// Display meetings ans get input
timetable.getNextMeetings(meetings.length).forEach(async meeting => {
    const endDate = new Date(meeting.date);
    endDate.setHours(meeting.date.getHours() + meeting.duration);
    console.log(`
${meeting.title}
${meeting.date.toLocaleDateString()}
${meeting.date.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}
`);
    
    let inp: string | null;

    while (true) { // TODO - fix getting input
        inp = prompt('Would you like to move the meeting [y/n]?');
        if (inp && 'yn'.includes(inp)) break;
    };

    moves.push(inp === 'y' ? prompt('>>>') : null);
});

// Move the specified meetings
const actions: (Action | null)[] = parse(moves);
console.log('\n\n');
try {
    timetable.perform(actions);
} catch (err) {
    console.error((err as Error).message);
}


console.log('\n\n=== Updated meetings ===');
timetable.getNextMeetings(meetings.length).forEach(async meeting => {
    const endDate = new Date(meeting.date);
    endDate.setHours(meeting.date.getHours() + meeting.duration);
    console.log(`
${meeting.title}
${meeting.date.toLocaleDateString()}
${meeting.date.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`);
});
