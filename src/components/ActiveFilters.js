import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';
import Trash from './Trash';

export default function ActiveFilters() {
  const { activeFilters } = useContext(AppContext);

  const decode = {
    population: 'Population',
    orbital_period: 'Orbital Period',
    diameter: 'Diameter',
    rotation_period: 'Rotation Period',
    surface_water: 'Surface Water',
  };

  return (
    <div className="active-filters-container">
      {activeFilters.length > 0 && activeFilters.map((e) => (
        <p
          key={ `${e.length}-${decode[e.column]}-${decode[e.operator]}-${e.num}` }
          className="active-filter-paragraph"
        >
          {`${decode[e.column]} ${e.operator} ${e.number}`}
          {' '}
          <span>
            <Trash />
          </span>
        </p>
      ))}
    </div>
  );
}
