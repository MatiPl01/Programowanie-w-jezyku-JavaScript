// import "editable-meeting.scss";

import Action from "../../enums/action.enum";
import Meeting from "../../types/meeting.type";


interface EditableMeetingProps {
  idx: number;
  meeting: Meeting;
  action: string | undefined;
  updateMeeting(idx: number, action: string): void;
};

const EditableMeeting: React.FC<EditableMeetingProps> = (
  { idx, meeting, action: currentAction, updateMeeting }
) => {
  const startTime = meeting.date.toLocaleTimeString();
  const endDate = new Date(meeting.date);
  endDate.setHours(meeting.date.getHours() + meeting.duration);
  const endTime = endDate.toLocaleTimeString();

  return (
    <article className="editable-meeting">
      <section className="editable-meeting__content">
        <h3 className="editable-meeting__title">{ meeting.title }</h3>
        <ul className="meeting__details">
          <li className="meeting__date">
            <span>Data spotkania</span>
            <span>{ meeting.date.toLocaleDateString() }</span>
          </li>
          <li className="meeting__duration">
            <span>Czas spotkania</span>
            <span>{ startTime }-{ endTime }</span>
          </li>
        </ul>
      </section>
      
      <section className="editable-meeting__edit">
        <h4 className="editable-meeting__heading">Przesuń spotkanie</h4>
        <select 
          name="action" 
          id="action" 
          value={currentAction || ''}
          onChange={e => updateMeeting(idx, e.target.value)
        }>
          <option value="">Brak zmian</option>
          {
            [
              ['d+', Action.DAY_LATER],
              ['d-', Action.DAY_EARLIER],
              ['h+', Action.HOUR_LATER],
              ['h-', Action.HOUR_EARLIER]
            ].map(([value, action]) => {
              return <option key={value} value={value}>{ action }</option>
            })
          }
        </select>
      </section>
    </article>
  );
};


export default EditableMeeting;
