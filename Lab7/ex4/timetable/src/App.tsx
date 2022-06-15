import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Timetable from "./routes/timetable/timetable";
import Edit from "./routes/edit/edit";
import Add from "./routes/add/add";
import NavBar from "./layout/nav-bar/nav-bar";
import TimetableClass from "./classes/timetable";


const App = () => {
  const timetable = new TimetableClass();
  
  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route path='/' element={<Timetable timetable={timetable} />}></Route>
        <Route path='/add' element={<Add createMeeting={timetable.put.bind(timetable)} />}></Route>
        <Route path='/edit' element={<Edit timetable={timetable} updateTimetable={timetable.perform.bind(timetable)} />}></Route>
      </Routes>
    </Fragment>
  );
};


export default App;
