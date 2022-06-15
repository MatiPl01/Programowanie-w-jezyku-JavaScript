import { NavLink } from "react-router-dom";
import "./nav-bar.scss";


const NavBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-bar__items">
        <li className="nav-bar__item">
          <NavLink className="nav-bar__link" to="/">Harmonogram</NavLink>
        </li>
        <li className="nav-bar__item">
          <NavLink className="nav-bar__link" to="/add">Dodawanie spotkania</NavLink>
        </li>
        <li className="nav-bar__item">
          <NavLink className="nav-bar__link" to="/edit">Edycja</NavLink>
        </li>
      </ul>
    </nav>
  )
};


export default NavBar;
