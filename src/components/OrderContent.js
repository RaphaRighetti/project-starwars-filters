import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';

export default function OrderContent() {
  const { orderColumn, setOrderColumn,
    planets, filteredPlanets, setFilteredPlanets, setActiveFilters,
    columnSelect, setColumnSelect, radioValue,
    setRadioValue, setOrderRules } = useContext(AppContext);

  const removeAll = () => {
    setActiveFilters([]);
    setFilteredPlanets({ ...planets, results: [...planets.results] });
    if (columnSelect === '') {
      setColumnSelect('population');
    }
  };

  const orderPlanets = () => {
    const newOrderRules = {
      isOrdered: true,
      column: orderColumn,
      sort: radioValue,
    };
    const nextPosition = 1;
    const prevPosition = -1;
    setOrderRules(newOrderRules);
    const orderedPlanets = [...filteredPlanets.results].sort((a, b) => {
      if (a[newOrderRules.column] === 'unknown') return nextPosition;
      if (b[newOrderRules.column] === 'unknown') return prevPosition;
      if (newOrderRules.sort === 'ASC') {
        return parseFloat(a[newOrderRules.column]) - parseFloat(b[newOrderRules.column]);
      }
      if (newOrderRules.sort === 'DESC') {
        return parseFloat(b[newOrderRules.column]) - parseFloat(a[newOrderRules.column]);
      }
      return 0;
    });
    setFilteredPlanets({
      ...filteredPlanets,
      results: orderedPlanets,
    });
  };

  return (
    <div className="order-container">
      <label htmlFor="order-column-id" className="select-label">
        Ordenar
        <select
          id="order-column-id"
          className="select-column"
          data-testid="column-sort"
          onChange={ ({ target }) => setOrderColumn(target.value) }
          value={ orderColumn }
        >
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
        </select>
      </label>
      <div className="radio-container">
        <label htmlFor="ascendente-input" className="radio-label">
          <input
            type="radio"
            name="order-path"
            className="radio-input"
            id="ascendente-input"
            value="ASC"
            checked={ radioValue === 'ASC' }
            onChange={ () => setRadioValue('ASC') }
            data-testid="column-sort-input-asc"
          />
          <p>Ascendente</p>
        </label>
        <label htmlFor="descendente-input" className="radio-label">
          <input
            type="radio"
            name="order-path"
            className="radio-input"
            id="descendente-input"
            value="DESC"
            checked={ radioValue === 'DESC' }
            onChange={ () => setRadioValue('DESC') }
            data-testid="column-sort-input-desc"
          />
          <p>Descendente</p>
        </label>
      </div>
      <button
        type="button"
        className="filter-btn"
        data-testid="column-sort-button"
        onClick={ orderPlanets }
        disabled={ radioValue === '' }
      >
        Ordenar
      </button>
      <button
        type="button"
        className="filter-btn"
        data-testid="button-remove-filters"
        onClick={ removeAll }
      >
        Remover filtros
      </button>
    </div>
  );
}
