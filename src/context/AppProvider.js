import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPlanets = async () => {
    try {
      const response = await fetch('https://swapi.dev/api/planets');
      if (!response.ok) {
        throw response.message;
      }
      const data = await response.json();
      const newData = {
        ...data,
        results: data.results.map((e) => ({ ...e })),
      };
      newData.results.forEach((e) => {
        delete e.residents;
      });
      setPlanets(newData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);
  return (
    <AppContext.Provider value={ { planets, loading } }>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
