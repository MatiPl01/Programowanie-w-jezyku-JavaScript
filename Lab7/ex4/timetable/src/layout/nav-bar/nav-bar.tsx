import { Link } from "react-router-dom";


const NavBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-bar__items">
        <li className="nav-bar__item">
          <Link className="nav-bar__link" to="/">Harmonogram</Link>
        </li>
        <li className="nav-bar__item">
          <Link className="nav-bar__link" to="/add">Dodawanie spotkania</Link>
        </li>
        <li className="nav-bar__item">
          <Link className="nav-bar__link" to="/edit">Edycja</Link>
        </li>
      </ul>
    </nav>
  )
};


export default NavBar;
