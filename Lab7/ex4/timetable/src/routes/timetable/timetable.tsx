import TimetableClass from "../../classes/timetable";
import Meeting from "../../components/meeting/meeting";
import "./timetable.scss";


interface TimetableProps {
  timetable: TimetableClass;
}

const Timetable: React.FC<TimetableProps> = props => {
  const { timetable } = props;
  const meetings = timetable.getNextMeetings(Infinity);

  return (
    <article className="timetable">
      <h2 className="timetable__heading heading-primary">
        {
          meetings.length ? 'Harmonogram spotkań' : 'Brak zaplanowanych spotkań'
        }
      </h2>
      <ul className="timetable__meetings">
        {
          meetings.map((meeting, idx) => {
            return (
              <li className="timetable__meeting" key={idx}>
                <Meeting meeting={meeting}/>
              </li>
            )
          })
        }
      </ul>
    </article>
  );
};


export default Timetable;
