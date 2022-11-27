import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';
import Trash from './Trash';

export default function ActiveFilters() {
  const { activeFilters, setActiveFilters, setColumnSelect,
    planets, setFilteredPlanets, orderRules } = useContext(AppContext);

  const decode = {
    population: 'Population',
    orbital_period: 'Orbital Period',
    diameter: 'Diameter',
    rotation_period: 'Rotation Period',
    surface_water: 'Surface Water',
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
        return parseFloat(b[orderRules.column]) - parseFloat(a[orderRules.column]);
      });
    }
  };

  const deleteFilter = (filter) => {
    const newActiveFilter = activeFilters.filter((e) => e !== filter);
    setActiveFilters(newActiveFilter);
    setColumnSelect(filter.column);
    const newPlanets = { ...planets, results: [...planets.results] };
    if (newActiveFilter.length === 0) {
      sortPlanets(newPlanets.results);
      return setFilteredPlanets(newPlanets);
    }
    newActiveFilter.forEach((element) => {
      newPlanets.results = newPlanets.results.filter((e) => {
        const num = element.number === '' ? 0 : parseFloat(element.number);
        if (element.operator === 'maior que') return parseFloat(e[element.column]) > num;
        if (element.operator === 'menor que') return parseFloat(e[element.column]) < num;
        return parseFloat(e[element.column]) === num;
      });
    });
    sortPlanets(newPlanets.results);
    setFilteredPlanets(newPlanets);
  };

  return (
    <div className="active-filters-container">
      {activeFilters.length > 0 && activeFilters.map((e) => (
        <p
          key={ `${e.length}-${decode[e.column]}-${decode[e.operator]}-${e.num}` }
          className="active-filter-paragraph"
          data-testid="filter"
        >
          {`${decode[e.column]} ${e.operator} ${e.number}`}
          {' '}
          <button type="button" className="btn-delete" onClick={ () => deleteFilter(e) }>
            <Trash />
          </button>
        </p>
      ))}
    </div>
  );
}
