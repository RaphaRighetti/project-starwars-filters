import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';
import Filters from './Filters';

export default function HomeContent() {
  const { filteredPlanets, planets, loading, nameInput } = useContext(AppContext);
  const planetKeys = loading ? [] : Object.keys(planets.results[0]);

  const planetsMapped = loading || filteredPlanets.results
    .filter((e) => e.name.toLowerCase().includes(nameInput.toLowerCase()))
    .map((e) => (
      <tr key={ e.name }>
        {planetKeys.map((keys) => (
          <td
            key={ `${e.name}-${keys}` }
            data-testid={ keys === 'name' && 'planet-name' }
          >
            {Array.isArray(e[keys]) ? (e[keys].map((link) => (
              <p key={ link }>{link}</p>
            ))) : e[keys] }
          </td>
        ))}
      </tr>
    ));

  return (
    <div className="main-content">
      <Filters />
      <div className="table-container">
        {loading && <h3>Carregando...</h3>}
        <table>
          <thead>
            <tr>
              {planetKeys.map((e) => (
                <th key={ e }>
                  {e.split('_').join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planetsMapped}
          </tbody>
        </table>
      </div>
    </div>
  );
}
