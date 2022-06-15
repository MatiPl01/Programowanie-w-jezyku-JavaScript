import { useState } from "react";
import Timetable from "../../classes/timetable";
import EditableMeeting from "../../components/editable-meeting/editable-meeting";
import Action from "../../enums/action.enum";
import parse from "../../utils/parse.util";
import "./edit.scss";


interface EditProps {
  timetable: Timetable;
  updateTimetable(actions: (Action | null)[]): void;
};

const Edit: React.FC<EditProps> = ({ timetable, updateTimetable }) => {
  const [meetings, setMeetings] = useState(timetable.getNextMeetings(Infinity));
  const [actions, setAction] = useState<string[]>([]);

  const setMeetingAction = (idx: number, action: string) => {
    const actionsCopy = [...actions];
    actionsCopy[idx] = action;
    setAction(actionsCopy);
  };

  const onReset = () => {
    setAction([]);
  };

  const onSubmit = () => {
    try {
      updateTimetable(parse(actions));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setMeetings(timetable.getNextMeetings(Infinity));
      onReset();
    }
  };

  return (
    <article className="edit">
      <h2 className="edit__heading heading-primary">Harmonogram spotkań</h2>
      <ul className="edit__meetings">
        {
          meetings.map((meeting, i) => {
            return (
              <li className="edit__meeting" key={i}>
                <EditableMeeting 
                  idx={i}
                  meeting={meeting}
                  action={actions[i]}
                  updateMeeting={setMeetingAction}
                />
              </li>
            )
          })
        }
      </ul>

      <menu className="edit__menu">
        <input className="edit__button edit__button--reset" type="reset" value="Wyczyść" onClick={onReset} />
        <input className="edit__button edit__button--submit" type="submit" value="Zatwierdź zmiany" onClick={onSubmit} />
      </menu>
    </article>
  );
};


export default Edit;
