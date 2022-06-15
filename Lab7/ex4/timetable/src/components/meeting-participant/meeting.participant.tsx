import "./meeting-participant.scss";


interface MeetingParticipantProps {
  email: string;
  removeParticipant(email: string): void;
};

const MeetingParticipant: React.FC<MeetingParticipantProps> = props => {
  return (
    <article className="meeting-participant">
      <h4 className="meeting-participant__email">{ props.email }</h4>
      <button onClick={() => props.removeParticipant(props.email)} className="meeting-participant__remove-btn">
        <svg className="meeting-participant__remove-icon">
          <use href="/assets/icons.svg#trash"></use>
        </svg>
      </button>
    </article>
  )
};


export default MeetingParticipant;
