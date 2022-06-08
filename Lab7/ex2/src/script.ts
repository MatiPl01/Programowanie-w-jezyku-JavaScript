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


interface ITimetable {
  canBeTransferredTo(date: Date): boolean;
  busy(date: Date): boolean;
  put(meeting: Meeting): boolean;
  get(date: Date): Meeting | null;
  perform(actions: Array<Action>): void;
};


class TNode {
  public readonly meeting: Meeting;
  public left: TNode | null = null;
  public right: TNode | null = null;
  public parent: TNode | null = null;

  constructor(meeting: Meeting) {
    this.meeting = meeting;
  }

  get startDate(): Date {
    return this.meeting.date;
  }

  get endDate(): Date {
    const newDate = new Date(this.startDate);
    newDate.setHours(this.startDate.getHours() + this.duration);
    return newDate;
  }

  get duration(): number {
    return this.meeting.duration;
  }

  /**
   * This function check if the meeting stored in this tree node
   * begins after the specific date
   * 
   * @param date 
   * @returns boolean
   */
  public startsAfter(date: Date): boolean {
    return this.startDate >= date;
  }

  /**
   * This function check if the meeting stored in this tree node
   * finished before the specific date
   * 
   * @param date 
   * @returns boolean
   */
  public endsBefore(date: Date): boolean {
    // [start, end) - assume that meeting is finished at 'end' (end = start + duration)
    return this.endDate <= date;
  }

  public takesPlaceAt(date: Date): boolean { 
    return this.startDate <= date && date < this.endDate;
  }
}


class Timetable implements ITimetable {
  private root: TNode | null = null;

  canBeTransferredTo(date: Date): boolean {   // TODO - this one makes no sense as there is no meeting specified
    throw new Error("Method not implemented.");
  }

  busy(date: Date): boolean {
    return this.get(date) != null;
  }

  put(meeting: Meeting): boolean {
    const node = new TNode(meeting);

    if (!this.root) this.root = node;
    else {
      let curr = this.root;
      while (true) {
        if (curr.endsBefore(node.startDate)) {
          if (curr.right) curr = curr.right;
          else {
            curr.right = node;
            node.parent = curr;
          }
          break;
        } else if (curr.startsAfter(node.endDate)) {
          if (curr.left) curr = curr.left;
          else {
            curr.left = node;
            node.parent = curr;
          }
          break;
        } else return false;
      }
    }

    return true;
  }

  get(date: Date): Meeting | null {
    let curr = this.root;

    while (curr) {
      if (curr.takesPlaceAt(date)) return curr.meeting;
      else if (curr.startsAfter(date)) curr = curr.left;
      else if (curr.endsBefore(date)) curr = curr.right;
    }

    return null;
  }

  perform(actions: Action[]): void {
    const meetings = this.getNextMeetings(actions.length);
    actions.forEach((action, i) => this.moveMeeting(meetings[i], action));
  }

  /**
   * @returns Meeting[] - subsequent meetings sorted by date
   */
  private getNextMeetings(meetingsCount: number): Meeting[] {
    const meetings = [];
    let curr = this.minNode();
    while (curr && --meetingsCount) {
      meetings.push(curr.meeting);
      curr = this.nextNode(curr);
    }
    return meetings;
  }

  private minNode(): TNode | null {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.left) curr = curr.left;
    return curr;
  }

  private nextNode(node: TNode): TNode | null {
    if (node.right) return node.right;
    while (node.parent) {
      if (node.parent.left == node) return node.parent;
      node = node.parent;
    }
    return null;
  }

  private moveMeeting(meeting: Meeting, action: Action): void {
    switch (action) {
      case Action.DAY_EARLIER:
        meeting.date.setDate(meeting.date.getDate() - 1);
        break;
      case Action.DAY_LATER:
        meeting.date.setDate(meeting.date.getDate() + 1);
        break;
      case Action.HOUR_EARLIER:
        if (meeting.date.getHours() < 9) {
          throw new Error('Meeting cannot start before 8:00');
        }
        meeting.date.setHours(meeting.date.getHours() - 1);
        break;
      case Action.HOUR_LATER:
        const newHour = meeting.date.getHours() + 1;
        if (newHour + meeting.duration > 20 ||
          newHour + meeting.duration == 20 && (meeting.date.getMinutes() > 0 || meeting.date.getSeconds() > 0)) {
          throw new Error('Meeting cannot end after 20:00');
        }
        meeting.date.setHours(newHour);
    }
  };
};


export {
  Timetable,
  Action
};
