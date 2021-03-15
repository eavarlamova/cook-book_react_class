import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';

import {
  Button,
  TextField,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  DragHandle as DragHandleIcon,
} from '@material-ui/icons/';
import { Pagination } from '@material-ui/lab';

import {
  getPagesLength,
  getListForRender,
  normolizeCurrentPage,
  chooseNumberFromString,
} from '../../utils/getTempValue';
import Cards from './components/Cards';
import Navbar from '../../components/Navbar';
import { ENTER } from '../../utils/constants';
import { setDataToLS, getDataFromLS } from '../../utils/localStorageMethods';

import './index.scss';

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
        dishId: null,
      },
      currentPage: 1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.updateDataInLS = this.updateDataInLS.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
    this.setChangingValueForCurrentDish = this.setChangingValueForCurrentDish.bind(this);
  }

  componentDidMount() {
    const {
      props: {
        match: {
          params: {
            id,
          },
        },
        history,
      },
      state: {
        currentIngredient,
      },
    } = this;
    const fakeURL = Boolean(getDataFromLS('allDishes').find(({ id: dishId }) => dishId === Number(id)) === undefined);
    if (fakeURL) history.push('/');
    const allIngredients = getDataFromLS('allIngredients');
    const allIngredientsOfCurrentDish = allIngredients
      .filter(({ dishId }) => dishId === id);
    this.setState({
      allIngredients,
      allIngredientsOfCurrentDish,
      currentIngredient: {
        ...currentIngredient,
        dishId: id,
      },
    });
  }

  handleChange({ target: { name, value } }) {
    const valueAfterNormolize = name === 'name' ? value : chooseNumberFromString(value);
    this.setState(({ currentIngredient: prevCurrentIngredient }) => ({
      currentIngredient: {
        ...prevCurrentIngredient,
        [name]: valueAfterNormolize,
      },
    }), () => {
      const {
        state: {
          currentIngredient: {
            gramsTotal,
            calloriesTotal,
            calloriesIn100Grams,
          },
        },
      } = this;
      this.setState(({ currentIngredient: prevCurrentIngredient }) => ({
        currentIngredient: {
          ...prevCurrentIngredient,
          calloriesTotal: name === 'name' ? calloriesTotal : ((calloriesIn100Grams / 100) * gramsTotal),
        },
      }));
    });
  }

  handleChangeCurrentPage(event, newCurrentPage) {
    this.setState({
      currentPage: newCurrentPage,
    });
  }

  handleKeyPress({ key }) {
    if (key === ENTER) this.addIngredient();
  }

  setChangingValueForCurrentDish() {
    const {
      state: {
        allIngredientsOfCurrentDish,
      },
      props: {
        match: {
          params: {
            id: idOfCurrentDish,
          },
        },
      },
    } = this;

    const totalValueForCurrentDish = allIngredientsOfCurrentDish
      .reduce((totalValue, { gramsTotal, calloriesTotal }) => ({
        grams: totalValue.grams + gramsTotal,
        callories: totalValue.callories + calloriesTotal,
      }), { grams: 0, callories: 0 });

    const allDishes = getDataFromLS('allDishes')
      .map((item) => (item.id === Number(idOfCurrentDish)
        ? {
          ...item,
          weight: totalValueForCurrentDish.grams,
          callories: totalValueForCurrentDish.callories,
        }
        : {
          ...item,
        }));
    setDataToLS('allDishes', allDishes);
  }

  updateDataInLS() {
    const { state: { allIngredients } } = this;
    setDataToLS('allIngredients', allIngredients);
    this.setChangingValueForCurrentDish();
  }

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
            id,
          },
        },
      },
    } = this;
    if (currentIngredient.name.trim() && currentIngredient.dishId === id) {
      const newIngredient = {
        ...currentIngredient,
        name: currentIngredient.name.trim(),
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
        this.setState(({ allIngredientsOfCurrentDish: prevAllIngredientsOfCurrentDish }) => ({
          currentPage: getPagesLength(prevAllIngredientsOfCurrentDish),
        }));
        this.updateDataInLS();
      });
    }
  }

  deleteIngredient(idOfDeletingIngredient) {
    const {
      state: {
        allIngredients,
        allIngredientsOfCurrentDish,
      },
    } = this;
    const updateAllIngredients = allIngredients.filter(({ id }) => id !== idOfDeletingIngredient);
    const updateAllIngredientsOfCurrentDish = allIngredientsOfCurrentDish
      .filter(({ id }) => id !== idOfDeletingIngredient);

    this.setState({
      allIngredients: updateAllIngredients,
      allIngredientsOfCurrentDish: updateAllIngredientsOfCurrentDish,
    }, () => {
      this.setState(({
        currentPage: prevCurrentPage,
        allIngredientsOfCurrentDish: prevAllIngredientsOfCurrentDish,
      }) => ({
        currentPage: normolizeCurrentPage(prevAllIngredientsOfCurrentDish, prevCurrentPage),
      }));
      this.updateDataInLS();
    });
  }

  render() {
    const {
      state: {
        allIngredientsOfCurrentDish,
        currentIngredient,
        currentPage,
      },
    } = this;
    const {
      name,
      gramsTotal,
      calloriesTotal,
      calloriesIn100Grams,
    } = currentIngredient;

    const allIngredientsOfCurrentDishLength = allIngredientsOfCurrentDish.length;
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
              onKeyPress={this.handleKeyPress}
              label="add name ingredient"
              fullWidth
            />
            <div className="ingredient__count-callories">
              <TextField
                name="calloriesIn100Grams"
                value={chooseNumberFromString(calloriesIn100Grams)}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                InputProps={{
                  startAdornment: <InputAdornment position="start">calls in 100grams</InputAdornment>,
                }}
                label="add in 100 grams"
              />
              <ClearIcon />
              <TextField
                name="gramsTotal"
                value={chooseNumberFromString(gramsTotal)}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
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
          <Typography color="textSecondary">
            {
              allIngredientsOfCurrentDishLength
                ? `steal ${allIngredientsOfCurrentDishLength} ingredients`
                : 'you have no any ingredients... change it!'
            }
          </Typography>
          <Cards
            allIngredients={ingredientListForRender}
            deleteIngredient={this.deleteIngredient}
            className="ingredient__card"
          />
          {
            allIngredientsOfCurrentDish.length
              ? (
                <Pagination
                  page={currentPage}
                  count={allPagesForRender}
                  onChange={this.handleChangeCurrentPage}
                />
              )
              : ''
          }
        </div>
      </>
    );
  }
}

Ingredients.propTypes = {
  match: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.bool,
    ]),
  ).isRequired,
  history: PropTypes.objectOf().isRequired,
};

export default withRouter(Ingredients);
