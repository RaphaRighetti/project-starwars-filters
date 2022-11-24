import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';

export default function NumFilter() {
  const {
    columnSelect,
    setColumnSelect,
    operatorSelect,
    setOperatorSelect,
    numInput,
    setNumInput,
    filteredPlanets,
    setFilteredPlanets,
    activeFilters,
    setActiveFilters } = useContext(AppContext);

  const filterPlanet = () => {
    const newPlanets = filteredPlanets.results.filter((e) => {
      const num = numInput === '' ? 0 : parseFloat(numInput);
      if (operatorSelect === 'maior que') return parseFloat(e[columnSelect]) > num;
      if (operatorSelect === 'menor que') return parseFloat(e[columnSelect]) < num;
      if (operatorSelect === 'igual a') return parseFloat(e[columnSelect]) === num;
      return true;
    });
    setFilteredPlanets({
      ...filteredPlanets,
      results: newPlanets,
    });
    setActiveFilters([...activeFilters, {
      column: columnSelect,
      operator: operatorSelect,
      number: numInput,
    }]);
  };

  return (
    <div className="number-filter-container">
      <label htmlFor="select-column-id" className="select-label">
        Coluna
        <select
          id="select-column-id"
          className="select-column"
          data-testid="column-filter"
          value={ columnSelect }
          onChange={ ({ target }) => setColumnSelect(target.value) }
        >
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
        </select>
      </label>
      <label htmlFor="select-operator-id" className="select-label">
        Operador
        <select
          id="select-operator-id"
          className="select-column"
          data-testid="comparison-filter"
          value={ operatorSelect }
          onChange={ ({ target }) => setOperatorSelect(target.value) }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
      </label>
      <div className="input-num-box">
        <label htmlFor="num-filter" className="label-input-name">
          <input
            type="number"
            id="num-filter"
            className="effect-2"
            data-testid="value-filter"
            value={ numInput }
            onChange={ ({ target }) => setNumInput(target.value) }
          />
          <span className="focus-border" />
        </label>
      </div>
      <button
        type="button"
        className="filter-btn"
        data-testid="button-filter"
        onClick={ filterPlanet }
      >
        Filtrar
      </button>
    </div>
  );
}
