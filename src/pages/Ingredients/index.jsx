import React, { PureComponent } from 'react';

import {
  Button,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  DragHandle as DragHandleIcon
} from '@material-ui/icons/';

import Cards from './components/Cards';
import Navbar from '../../components/Navbar';
import { setDataToLS, getDataFromLS } from '../../utils/localStorageMethods';
import { getListForRender, getPagesLength, normolizeCurrentPage } from '../../utils/getTempValue';

import './index.scss';
import { Pagination } from '@material-ui/lab';

class Ingredients extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      allIngredients: [],
      allIngredientsOfCurrentDish: [],
      currentIngredient: {
        id: Math.random(),
        name: '',
        gramsTotal: 0,
        calloriesTotal: 0,
        calloriesIn100Grams: 0,
        dishId: this.props.match.params.id,
      },
      currentPage: 1,
    }

    this.handleChange = this.handleChange.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.updateDataInLS = this.updateDataInLS.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.chooseNumberFromString = this.chooseNumberFromString.bind(this);
    this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
    this.setChangingValueForCurrentDish = this.setChangingValueForCurrentDish.bind(this);
  };

  componentDidMount() {
    const allIngredients = getDataFromLS('allIngredients');
    const allIngredientsOfCurrentDish = allIngredients.filter(({ dishId }) => dishId === this.props.match.params.id);
    this.setState({
      allIngredients: allIngredients,
      allIngredientsOfCurrentDish: allIngredientsOfCurrentDish,
    })
  };

  chooseNumberFromString(value) {
    return Number(String(value).replace(/\D/g, ''));
  };

  setChangingValueForCurrentDish() {
    const {
      state: {
        allIngredientsOfCurrentDish,
      },
      props: {
        match: {
          params: {
            id: idOfCurrentDish
          }
        }
      }
    } = this;

    const totalValueForCurrentDish = allIngredientsOfCurrentDish.reduce((totalValue, { gramsTotal, calloriesTotal }) => ({
      grams: totalValue.grams + gramsTotal,
      callories: totalValue.callories + calloriesTotal,
    }), { grams: 0, callories: 0 });

    const allDishes = getDataFromLS('allDishes')
      .map((item) =>
        item.id === Number(idOfCurrentDish)
          ?
          {
            ...item,
            weight: totalValueForCurrentDish.grams,
            callories: totalValueForCurrentDish.callories
          }
          :
          {
            ...item
          }
      );
    setDataToLS('allDishes', allDishes);
  };

  handleChange({ target: { name, value } }) {
    const valueAfterNormolize = name === 'name' ? value : this.chooseNumberFromString(value);
    this.setState({
      currentIngredient: {
        ...this.state.currentIngredient,
        [name]: valueAfterNormolize,
      },
    }, () => {
      const {
        state: {
          currentIngredient: {
            gramsTotal,
            calloriesTotal,
            calloriesIn100Grams,
          }
        }
      } = this;
      this.setState({
        currentIngredient: {
          ...this.state.currentIngredient,
          calloriesTotal: name === 'name' ? calloriesTotal : calloriesIn100Grams / 100 * gramsTotal
        }
      })
    })
  };

  handleChangeCurrentPage(event, newCurrentPage) {
    this.setState({
      currentPage: newCurrentPage,
    })
  };

  updateDataInLS() {
    setDataToLS('allIngredients', this.state.allIngredients);
    this.setChangingValueForCurrentDish();
  };

  addIngredient() {
    const {
      state: {
        allIngredients,
        currentIngredient,
        allIngredientsOfCurrentDish,
      },
      props: {
        match: {
          params: {
            id
          }
        }
      }
    } = this;
    if (currentIngredient.name.trim() && currentIngredient.dishId === id) {
      const newIngredient = {
        ...currentIngredient,
        name: currentIngredient.name.trim()
      };
      this.setState({
        allIngredients: [
          ...allIngredients,
          newIngredient,
        ],
        allIngredientsOfCurrentDish: [
          ...allIngredientsOfCurrentDish,
          newIngredient,
        ],
        currentIngredient: {
          id: Math.random(),
          name: '',
          calloriesIn100Grams: 0,
          gramsTotal: 0,
          calloriesTotal: 0,
          dishId: id,
        },
      }, () => {
        this.setState({
          currentPage: getPagesLength(this.state.allIngredientsOfCurrentDish),
        })
        this.updateDataInLS();
      })
    }
  };

  deleteIngredient(idOfDeletingIngredient) {
    const {
      state: {
        allIngredients,
        allIngredientsOfCurrentDish,
      }
    } = this;
    const updateAllIngredients = allIngredients.filter(({ id }) => id !== idOfDeletingIngredient);
    const updateAllIngredientsOfCurrentDish = allIngredientsOfCurrentDish.filter(({ id }) => id !== idOfDeletingIngredient);

    this.setState({
      allIngredients: updateAllIngredients,
      allIngredientsOfCurrentDish: updateAllIngredientsOfCurrentDish,
    }, () => {
      this.setState(({ allIngredientsOfCurrentDish, currentPage }) => ({
        currentPage: normolizeCurrentPage(allIngredientsOfCurrentDish, currentPage)
      }))
      this.updateDataInLS();
    })
  };

  render() {
    const {
      state: {
        allIngredientsOfCurrentDish,
        currentIngredient,
        currentPage,
      }
    } = this;
    const {
      name,
      gramsTotal,
      calloriesTotal,
      calloriesIn100Grams,
    } = currentIngredient;

    const ingredientListForRender = getListForRender(allIngredientsOfCurrentDish, currentPage);
    const allPagesForRender = getPagesLength(allIngredientsOfCurrentDish);
    return (
      <>
        <Navbar> ingredients </Navbar>
        <div className="ingredient">
          <div className="ingredient__add-form">
            <TextField
              name="name"
              value={name}
              onChange={this.handleChange}
              label="add name ingredient"
              fullWidth
            />
            <div className='ingredient__count-callories'>
              <TextField
                name="calloriesIn100Grams"
                value={this.chooseNumberFromString(calloriesIn100Grams)}
                onChange={this.handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">calls in 100grams</InputAdornment>,
                }}
                label="add in 100 grams"
              />
              <ClearIcon />
              <TextField
                name="gramsTotal"
                value={this.chooseNumberFromString(gramsTotal)}
                onChange={this.handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">total grams</InputAdornment>,
                }}
                label="add total grams this ingredient"
              />
              <DragHandleIcon />
              <TextField
                disabled
                value={calloriesTotal}
                InputProps={{
                  startAdornment: <InputAdornment position="start">total calls</InputAdornment>,
                }}
                label="it`s total callories in this ingredient"
              />
            </div>
            <Button
              onClick={this.addIngredient}
              color="primary"
              variant="contained"
              fullWidth
            >
              add ingredient
          </Button>
          </div>
          <Cards
            allIngredients={ingredientListForRender}
            deleteIngredient={this.deleteIngredient}
            className="ingredient__card"
          />
          {
            allIngredientsOfCurrentDish.length
              ?
              <Pagination page={currentPage} count={allPagesForRender} onChange={this.handleChangeCurrentPage} />
              :
              'you have no ingredients... change it!'
          }
        </div>
      </>
    )
  }
};

export default Ingredients;
