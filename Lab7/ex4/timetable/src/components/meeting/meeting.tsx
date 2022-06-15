import IMeeting from "../../types/meeting.type";
import "./meeting.scss";


interface MeetingProps {
  meeting: IMeeting;
};

const Meeting: React.FC<MeetingProps> = ({ meeting }) => {
  const startTime = meeting.date.toLocaleTimeString();
  const endDate = new Date(meeting.date);
  endDate.setHours(meeting.date.getHours() + meeting.duration);
  const endTime = endDate.toLocaleTimeString();

  return (
    <article className="meeting">
      <h3 className="meeting__title">{ meeting.title }</h3>
      <ul className="meeting__details">
        <li className="meeting__date">
          <span>Data spotkania</span>
          <span>{ meeting.date.toLocaleDateString() }</span>
        </li>
        <li className="meeting__duration">
          <span>Czas spotkania</span>
          <span>{ startTime }-{ endTime }</span>
        </li>
        <li className="meeting__participants">
          <span>Uczestnicy spotkania</span>
          <ul className="meeting__participants-list">
            {
              meeting.participants.map((email, idx) => <li key={idx} className="meeting__participant">{ email }</li>)
            }
          </ul>
        </li>
      </ul>
    </article>
  );
};


export default Meeting;
