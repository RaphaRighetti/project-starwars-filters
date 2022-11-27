import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [columnSelect, setColumnSelect] = useState('population');
  const [operatorSelect, setOperatorSelect] = useState('maior que');
  const [numInput, setNumInput] = useState('0');
  const [activeFilters, setActiveFilters] = useState([]);
  const [orderColumn, setOrderColumn] = useState('population');
  const [radioValue, setRadioValue] = useState('');
  const [orderRules, setOrderRules] = useState({
    isOrdered: false,
    column: '',
    sort: '',
  });
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
      setFilteredPlanets(newData);
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
    <AppContext.Provider
      value={ {
        planets,
        loading,
        filteredPlanets,
        setFilteredPlanets,
        nameInput,
        setNameInput,
        columnSelect,
        setColumnSelect,
        operatorSelect,
        setOperatorSelect,
        numInput,
        setNumInput,
        activeFilters,
        setActiveFilters,
        orderColumn,
        setOrderColumn,
        radioValue,
        setRadioValue,
        orderRules,
        setOrderRules,
      } }
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
