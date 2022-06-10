import Meeting from "../types/meeting.type";
import Action from "../enums/action.enum";


export default interface ITimetable {
    canBeTransferredTo(meeting: Meeting, date: Date): boolean;
    busy(date: Date): boolean;
    put(meeting: Meeting): boolean;
    get(date: Date): Meeting | null;
    perform(actions: Array<Action>): void;
    getNextMeetings(meetingsCount: number): Meeting[];
};
