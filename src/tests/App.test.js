import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import App from '../App';
import data from './data/data';
import userEvent from '@testing-library/user-event';

describe('Testa a aplicação', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({json: jest.fn().mockResolvedValue(data), ok: true});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('testa carregamento da api', async () => {
    render(<App />);
    const loading = screen.getByRole('heading', { name: /carregando.../i, level: 3 });
    expect(loading).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /carregando.../i, level: 3 }), {timeout: 3000});
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('testa se ordenamento ascendente e descendente', async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /carregando.../i, level: 3 }), {timeout: 3000});
    const desc = screen.getByText(/descendente/i);
    userEvent.click(desc);
    const descCheckbox = screen.getByRole('radio', {name: /descendente/i});
    const ascCheckbox =screen.getByRole('radio', {name: /ascendente/i});
    expect(descCheckbox.checked).toBe(true);
    const orderBtn = screen.getByRole('button', {name: /ordenar/i});
    expect(orderBtn).toBeInTheDocument();
    userEvent.click(orderBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    userEvent.click(ascCheckbox);
    userEvent.click(orderBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Yavin IV');
    const numInput = screen.getByRole('spinbutton');
    userEvent.type(numInput, '5000');
    const filterBtn = screen.getByRole('button', {name: /filtrar/i});
    userEvent.click(filterBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Tatooine');
    const view = screen.getByText(/population maior que 05000/i);
    const trashBtn = within(view).getByRole('button');
    expect(trashBtn).toBeInTheDocument();
    expect(view).toBeInTheDocument();
    userEvent.click(trashBtn);
    expect(view).not.toBeInTheDocument();
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Yavin IV');
    userEvent.click(descCheckbox);
    userEvent.click(orderBtn);
    userEvent.type(numInput, '7000000');
    userEvent.click(filterBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    const newView = screen.getByText(/population maior que 050007000000/i);
    const newTrash = within(newView).getByRole('button');
    userEvent.click(newTrash);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    const allPlanets = screen.getAllByTestId('planet-name');
    expect(allPlanets.length).toBe(10);
  });

  it('testa erro na API', async () => {
    jest.clearAllMocks();
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({ok: false, message: 'erro'});
    render(<App />);
    jest.spyOn(global.console, 'log');
    await waitFor(() => {
      expect(console.log).toBeCalled();
      expect(console.log).toBeCalledWith('erro');
    }, {timeout: 3000});
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('testa filtro pelo nome', async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /carregando.../i, level: 3 }), {timeout: 3000});
    const nameFilter = screen.getByRole('textbox');
    userEvent.type(nameFilter, 'Endor');
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Endor');
  });

  it('testa remoção de filtros', async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /carregando.../i, level: 3 }), {timeout: 3000});
    const filterBtn = screen.getByRole('button', {name: /filtrar/i});
    const ascCheckbox =screen.getByRole('radio', {name: /ascendente/i});
    const descCheckbox = screen.getByRole('radio', {name: /descendente/i});
    const orderBtn = screen.getByRole('button', {name: /ordenar/i});
    userEvent.click(ascCheckbox);
    userEvent.click(orderBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    const numInput = screen.getByRole('spinbutton');
    const operatorSelect = screen.getByRole('combobox', {name: /operador/i});
    userEvent.type(numInput, '15000');
    userEvent.selectOptions(operatorSelect, 'menor que');
    userEvent.click(filterBtn);
    userEvent.selectOptions(operatorSelect, 'igual a');
    userEvent.type(numInput, '{backspace}{backspace}{backspace}{backspace}{backspace}24');
    userEvent.click(filterBtn);
    const firstTrash = within(screen.getByText(/population maior que 0/i)).getByRole('button');
    const secondTrash = within(screen.getByText(/orbital period maior que 0/i)).getByRole('button');
    const thirdTrash = within(screen.getByText(/diameter menor que 015000/i)).getByRole('button');
    const fourthTrash = within(screen.getByText(/rotation period igual a 024/i)).getByRole('button');
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Yavin IV');
    userEvent.click(firstTrash);
    userEvent.click(fourthTrash);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Yavin IV');
    userEvent.click(descCheckbox);
    userEvent.click(orderBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    userEvent.click(thirdTrash);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    expect(screen.getAllByTestId('planet-name')[1]).toHaveTextContent('Naboo');
    userEvent.click(secondTrash);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    const allPlanets = screen.getAllByTestId('planet-name');
    expect(allPlanets.length).toBe(10);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    expect((screen.queryAllByTestId('planet-name')).length).toBe(0);
    const removeAllBtn = screen.getByRole('button', {name: /remover filtros/i});
    userEvent.click(removeAllBtn);
    expect((screen.getAllByTestId('planet-name')).length).toBe(10);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    userEvent.selectOptions(operatorSelect, 'maior que');
    userEvent.click(filterBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Coruscant');
    const columnSelect = screen.getByRole('combobox', { name: /coluna/i });
    userEvent.selectOptions(columnSelect, 'surface_water');
    expect(columnSelect.value).toBe('surface_water');
    const orderSelect = screen.getByRole('combobox', { name: /ordenar/i });
    userEvent.selectOptions(orderSelect, 'surface_water');
    userEvent.click(ascCheckbox);
    userEvent.click(orderBtn);
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Bespin');
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(filterBtn);
    userEvent.click(removeAllBtn);
    expect(columnSelect.value).toBe('population');
    expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Bespin');
  });

  test('testa se --unknown-- fica na ultima posição', async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /carregando.../i, level: 3 }), {timeout: 3000});
    const ascCheckbox =screen.getByRole('radio', {name: /ascendente/i});
    const orderBtn = screen.getByRole('button', {name: /ordenar/i});
    const filterBtn = screen.getByRole('button', {name: /filtrar/i});
    userEvent.click(ascCheckbox);
    userEvent.click(orderBtn);
    expect(screen.getAllByTestId('planet-name')[9]).toHaveTextContent('Dagobah');
    const columnSelect = screen.getByRole('combobox', { name: /coluna/i });
    userEvent.selectOptions(columnSelect, 'diameter');
    const numInput = screen.getByRole('spinbutton');
    userEvent.type(numInput, '{backspace}');
    userEvent.click(filterBtn);
    expect(screen.getAllByTestId('planet-name').length).toBe(10);
    expect(screen.getAllByTestId('planet-name')[9]).toHaveTextContent('Dagobah');
  })
});
