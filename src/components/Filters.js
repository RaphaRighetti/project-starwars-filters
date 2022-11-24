import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';
import ActiveFilters from './ActiveFilters';
import Lupa from './Lupa';
import NumFilter from './NumFilter';

export default function Filters() {
  const { nameInput, setNameInput } = useContext(AppContext);
  return (
    <div className="filters-container">
      <div className="input-box">
        <label htmlFor="name-filter" className="label-input-name">
          <Lupa />
          <input
            type="text"
            id="name-filter"
            className="effect-2"
            placeholder="Filtrar por nome"
            data-testid="name-filter"
            value={ nameInput }
            onChange={ (event) => setNameInput(event.target.value) }
          />
          <span className="focus-border" />
        </label>
      </div>
      <div className="number-order-container">
        <NumFilter />
      </div>
      <ActiveFilters />
    </div>
  );
}
