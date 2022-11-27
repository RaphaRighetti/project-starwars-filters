import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';

export default function NumFilter() {
  const {
    loading,
    columnSelect,
    setColumnSelect,
    operatorSelect,
    setOperatorSelect,
    numInput,
    setNumInput,
    filteredPlanets,
    setFilteredPlanets,
    activeFilters,
    setActiveFilters,
    orderRules } = useContext(AppContext);

  const maxFilters = 5;

  const handleColumn = (updateActiveFilters) => {
    const columnValues = [
      'population',
      'orbital_period',
      'diameter',
      'rotation_period',
      'surface_water'];

    if (updateActiveFilters.length >= maxFilters) {
      setColumnSelect('');
    } else {
      for (let i = 0; i < columnValues.length; i += 1) {
        if (!updateActiveFilters.some((filters) => filters.column === columnValues[i])) {
          setColumnSelect(columnValues[i]);
          break;
        }
      }
    }
  };

  const sortPlanets = (arr) => {
    if (orderRules.isOrdered) {
      const nextPosition = 1;
      const prevPosition = -1;
      arr.sort((a, b) => {
        if (a[orderRules.column] === 'unknown') return nextPosition;
        if (b[orderRules.column] === 'unknown') return prevPosition;
        if (orderRules.sort === 'ASC') {
          return parseFloat(a[orderRules.column]) - parseFloat(b[orderRules.column]);
        }
        if (orderRules.sort === 'DESC') {
          return parseFloat(b[orderRules.column]) - parseFloat(a[orderRules.column]);
        }
        return 0;
      });
    }
  };

  const filterPlanet = () => {
    const newPlanets = filteredPlanets.results.filter((e) => {
      const num = numInput === '' ? 0 : parseFloat(numInput);
      if (operatorSelect === 'maior que') return parseFloat(e[columnSelect]) > num;
      if (operatorSelect === 'menor que') return parseFloat(e[columnSelect]) < num;
      if (operatorSelect === 'igual a') return parseFloat(e[columnSelect]) === num;
      return true;
    });
    sortPlanets(newPlanets);
    setFilteredPlanets({
      ...filteredPlanets,
      results: newPlanets,
    });
    setActiveFilters([...activeFilters, {
      column: columnSelect,
      operator: operatorSelect,
      number: numInput,
    }]);
    const updateActiveFilters = [...activeFilters, {
      column: columnSelect,
      operator: operatorSelect,
      number: numInput,
    }];
    handleColumn(updateActiveFilters);
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
          {activeFilters.some((e) => e.column === 'population')
          || (<option value="population">population</option>)}
          {activeFilters.some((e) => e.column === 'orbital_period')
          || (<option value="orbital_period">orbital_period</option>)}
          {activeFilters.some((e) => e.column === 'diameter')
          || (<option value="diameter">diameter</option>)}
          {activeFilters.some((e) => e.column === 'rotation_period')
          || (<option value="rotation_period">rotation_period</option>)}
          {activeFilters.some((e) => e.column === 'surface_water')
          || (<option value="surface_water">surface_water</option>)}
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
        disabled={ loading || activeFilters.length >= maxFilters }
      >
        Filtrar
      </button>
    </div>
  );
}
