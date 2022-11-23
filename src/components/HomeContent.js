import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppProvider';

export default function HomeContent() {
  const { planets, loading } = useContext(AppContext);
  useEffect(() => console.log(planets), [planets]);
  const planetKeys = loading ? [] : Object.keys(planets.results[0]);
  const planetsMapped = loading || planets.results.map((e) => (
    <tr key={ e.name }>
      {planetKeys.map((keys) => (
        <td key={ `${e.name}-${keys}` }>
          {Array.isArray(e[keys]) ? (e[keys].map((link) => (
            <p key={ link }>{link}</p>
          ))) : e[keys] }
        </td>
      ))}
    </tr>
  ));

  return (
    <div className="main-content">
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
