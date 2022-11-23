// import { useContext } from 'react';
// import { AppContext } from '../context/AppProvider';
import logo from '../img/star-wars-logo.png';

export default function Header() {
  // const states = useContext(AppContext);
  return (
    <header>
      <img src={ logo } alt="star wars logo" className="logo" />
    </header>
  );
}
