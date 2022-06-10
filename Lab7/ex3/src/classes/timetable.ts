import Meeting from '../types/meeting.type';
import Action from '../enums/action.enum';
import ITimetable from '../interfaces/timetable.interface';


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


export default class Timetable implements ITimetable {
  private root: TNode | null = null;

  public canBeTransferredTo(meeting: Meeting, date: Date): boolean {  // O(log(n))
    if (!this.isTimeValid(date, meeting.duration)) return false;
    if (!this.root) return true;

    const startDate = date;
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + meeting.duration);

    // Remove the specified meeting node
    const existed = this.remove(meeting);
    let result: boolean | null = null;

    let curr = this.root;
    while (result === null) {
      if (curr.endsBefore(startDate)) {
        if (curr.right) curr = curr.right;
        else result = true;
      } else if (curr.startsAfter(endDate)) {
        if (curr.left) curr = curr.left;
        else result = true;
      } else result = false;
    }

    // Put back the removed meeting
    if (existed) this.put(meeting);
    return result;
  }

  public busy(date: Date): boolean {  // O(log(n))
    return this.get(date) != null;
  }

  public put(meeting: Meeting): boolean {  // O(log(n))
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
            break;
          }
        } else if (curr.startsAfter(node.endDate)) {
          if (curr.left) curr = curr.left;
          else {
            curr.left = node;
            node.parent = curr;
            break;
          }
        } else return false;
      }
    }

    return true;
  }

  public get(date: Date): Meeting | null {  // O(log(n))
    return this.findNode(date)?.meeting || null;
  }

  public perform(actions: (Action | null)[]): void {  // O(k log(n)), where k is the number of not null actions
    // Remove all modified meetings
    const meetings = this.getNextMeetings(actions.length);
    const removedMeetings: Meeting[] = [];
    const updatedMeetings: Meeting[] = [];
    
    for (let i = 0; i < Math.min(actions.length, meetings.length); i++) {
      const action = actions[i];
      if (!action) continue;
      const meeting = meetings[i];
      this.remove(meeting);
      removedMeetings.push({ ...meeting });
      meeting.date = this.getNewDate(meeting.date, action);

      if (!this.isTimeValid(meeting.date, meeting.duration)) {
        // Restore removed meetings nodes
        removedMeetings.forEach(meeting => this.put(meeting));
        throw new Error('Could not move the specified meetings');
      }

      updatedMeetings.push(meeting);
    }

    // Insert all updated meetings to the tree
    updatedMeetings.forEach((meeting, idx) => {
      if (!this.put(meeting)) {
        // Remove all inserted updated meetings
        for (let i = 0; i < idx; i++) this.remove(updatedMeetings[i]);
        // Restore removed meetings nodes
        removedMeetings.forEach(meeting => this.put(meeting));
        throw new Error('Could not move the specified meetings');
      }
    });
  }

  public getNextMeetings(meetingsCount: number): Meeting[] {  // O(n)
    const meetings: Meeting[] = [];
    let curr = this.minNode();

    while (curr && meetingsCount--) {
      meetings.push(curr.meeting);
      curr = this.nextNode(curr);
    }
    return meetings;
  }

  public remove(meeting: Meeting): boolean {  // O(log(n))
    const node = this.findNode(meeting.date);
    if (!node) return false;
    return this.removeNode(node);
  }

  private removeNode(node: TNode): boolean {  // O(log(n))
    if (!node.right) {
      if (node.parent) {
        if (node === node.parent.right) node.parent.right = node.left;
        else node.parent.left = node.left;
        if (node.left) node.left.parent = node.parent;
      } else {
        this.root = node.left;
        if (this.root) this.root.parent = null;
      }

    } else if (!node.left) {
      if (node.parent) {
        if (node === node.parent.right) node.parent.right = node.right;
        else node.parent.left = node.right;
        if (node.right) node.right.parent = node.parent;
      } else {
        this.root = node.right;
        if (this.root) this.root.parent = null;
      }

    } else {
      const nextNode = this.nextNode(node);
      if (nextNode) {
        this.removeNode(nextNode);

        if (node === this.root) this.root = nextNode;
        else if (node === node?.parent?.right) node.parent.right = nextNode;
        else if (node.parent) node.parent.left = nextNode;

        nextNode.left = node.left;
        nextNode.right = node.right;
        nextNode.parent = node.parent;
        if (node.right) node.right.parent = nextNode;
        if (node.left) node.left.parent = nextNode;
      }
    }

    node.left = node.right = node.parent = null;

    return true;
  }

  private findNode(date: Date): TNode | null {  // O(log(n))
    let curr = this.root;

    while (curr) {
      if (curr.takesPlaceAt(date)) return curr;
      else if (curr.startsAfter(date)) curr = curr.left;
      else if (curr.endsBefore(date)) curr = curr.right;
    }

    return null;
  }

  private minNode(): TNode | null {  // O(log(n))
    if (!this.root) return null;
    let curr = this.root;
    while (curr.left) curr = curr.left;
    return curr;
  }

  private minChild(node: TNode): TNode | null {
    while (node.left) node = node.left;
    return node;
  }

  private nextNode(node: TNode): TNode | null {  // O(log(n))
    if (node.right) return this.minChild(node.right);
    while (node.parent) {
      if (node.parent.left == node) return node.parent;
      node = node.parent;
    }
    return null;
  }

  private getNewDate(date: Date, action: Action): Date {  // O(1)
    const newDate = new Date(date);

    switch (action) {
      case Action.DAY_EARLIER:
        newDate.setDate(newDate.getDate() - 1);
        break;
      case Action.DAY_LATER:
        newDate.setDate(newDate.getDate() + 1);
        break;
      case Action.HOUR_EARLIER:
        newDate.setHours(newDate.getHours() - 1);
        break;
      case Action.HOUR_LATER:
        newDate.setHours(newDate.getHours() + 1);
        break;
    }

    return newDate;
  }

  private isTimeValid(date: Date, duration: number): boolean {  // O(1)
    if (date.getHours() < 8) return false;
    if (date.getHours() + duration > 20 ||
      date.getHours() + duration == 20 && (date.getMinutes() > 0 || date.getSeconds() > 0)) {
      return false;
    }
    return true;
  }
}
