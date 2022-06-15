// import "./add.scss";  // FIXME

import React, { FormEvent, useState } from "react";
import MeetingParticipant from "../../components/meeting-participant/meeting.participant";
import Meeting from "../../types/meeting.type";


interface AddProps {
  createMeeting(meeting: Meeting): boolean;
};


const Add: React.FC<AddProps> = props => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState(0);

  const onAddParticipantClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (participants.indexOf(email) === -1) {
      email && setParticipants([...participants, email]);
      setEmail('');
    }
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter(participantEmail => participantEmail !== email));
  };

  const onDateInput = (dateString: string) => {
    let date;
    if (dateString.length) date = new Date(dateString);
    setDate(date);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.length && date && duration && participants.length) {
      if (!props.createMeeting({ title, date, duration, participants })) {
        alert('Nie można utworzyć spotkania. Nieprawidłowy czas spotkania.');
      } else {
        (e.target as HTMLFormElement).reset();
        onReset();
      }
    }
  };

  const onReset = () => {
    setParticipants([]);
  };

  return (
    <article className="add-meeting">
      <h2 className="add-meeting__heading">Zaplanuj spotkanie</h2>

      <form className="add-meeting__form" onSubmit={onSubmit}>
        <input type="text" name="title" id="title" className="add-meeting__input add-meeting__input--title" placeholder="Nazwa spotkania" onInput={e => setTitle((e.target as HTMLInputElement).value)} />
        <input type="datetime-local" name="date" id="date" className="add-meeting__input add-meeting__input--date" onInput={e => onDateInput((e.target as HTMLInputElement).value)}/>
        <input type="number" name="duration" id="duration" placeholder="Czas trwania" min="1" max="12" onInput={e => setDuration(+(e.target as HTMLInputElement).value)} />

        <label>
          <input type="email" name="email" id="email" placeholder="Email uczestnika" value={email} onInput={e => setEmail((e.target as HTMLInputElement).value)} />
          <button className="add-meeting__button" onClick={onAddParticipantClick}>
            <svg className="add-meeting__icon">
              <use href="/assets/icons.svg#plus" />
            </svg>
          </button>
        </label>
      
        <ul className="add-meeting__participants">
          {
            participants.map(email => {
              return <li key={email}><MeetingParticipant email={email} removeParticipant={removeParticipant} /></li>
            })
          }
        </ul>

        <menu className="add-meeting__menu">
          <input type="submit" value="Zapisz" />
          <input type="reset" value="Wyczyść" onClick={onReset} />
        </menu>
      </form>
    </article>
  )
};


export default Add;
