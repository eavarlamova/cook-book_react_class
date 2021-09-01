import React, {
  PureComponent,
} from 'react';

import {
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import Cards from './components/Cards';
import Navbar from '../../components/Navbar';
import { ENTER } from '../../utils/constants';
import {
  getPagesLength,
  getListForRender,
  normolizeCurrentPage,
} from '../../utils/getTempValue';
import {
  setDataToLS,
  getDataFromLS,
} from '../../utils/localStorageMethods';

import './index.scss';

class Dishes extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      allDishes: [],
      currentDish: {
        id: Math.random(),
        name: '',
        weight: 0,
        callories: 0,
        discription: '',
      },
      currentPage: 1,
    };

    this.addDish = this.addDish.bind(this);
    this.deleteDish = this.deleteDish.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
  }

  componentDidMount() {
    this.setState({
      allDishes: getDataFromLS('allDishes'),
    });
  }

  handleChange({ target: { name, value } }) {
    const { state: { currentDish } } = this;
    this.setState({
      currentDish: { ...currentDish, [name]: value },
    });
  }

  handleChangeCurrentPage(event, newCurrentPage) {
    this.setState({
      currentPage: newCurrentPage,
    });
  }

  handleKeyPress({ key }) {
    if (key === ENTER) this.addDish();
  }

  addDish() {
    const {
      state: {
        allDishes,
        currentDish,
      },
    } = this;
    if (currentDish.name.trim() && currentDish.discription.trim()) {
      this.setState({
        allDishes: [
          ...allDishes,
          {
            ...currentDish,
            name: currentDish.name.trim(),
            discription: currentDish.discription.trim(),
          },
        ],
        currentDish: {
          id: Math.random(),
          name: '',
          weight: 0,
          callories: 0,
          discription: '',
        },
      }, () => {
        const { state: { allDishes: allDishesUpdate } } = this;
        setDataToLS('allDishes', allDishesUpdate);
        this.handleChangeCurrentPage(null, getPagesLength(allDishesUpdate));
      });
    }
  }

  deleteDish(idOfCurrentDish) {
    const { state: { allDishes } } = this;
    const updateAllDishes = allDishes.filter(({ id }) => id !== idOfCurrentDish);
    this.setState({
      allDishes: updateAllDishes,
    }, () => {
      const { state: { allDishes: allDishesUpdate, currentPage } } = this;
      this.setState({
        currentPage: normolizeCurrentPage(allDishesUpdate, currentPage),
      });
      setDataToLS('allDishes', allDishesUpdate);
      const allIngredients = getDataFromLS('allIngredients').filter(({ dishId }) => (Number(dishId) !== idOfCurrentDish));
      setDataToLS('allIngredients', allIngredients);
    });
  }

  render() {
    const {
      state: {
        currentDish: {
          name,
          discription,
        },
        allDishes,
        currentPage,
      },
    } = this;

    const dishListForRender = getListForRender(allDishes, currentPage);
    const lengthOfAllDishes = allDishes.length;
    const allPages = getPagesLength(allDishes);

    return (
      <div className="dish">
        <Navbar> dishes </Navbar>
        <div className="dish__add-form">
          <TextField
            fullWidth
            name="name"
            value={name}
            label="add name dish"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <TextField
            fullWidth
            multiline
            name="discription"
            value={discription}
            label="add discription dish"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={this.addDish}
          >
            add dish
          </Button>

          <Typography color="textSecondary">
            {
              lengthOfAllDishes
                ? `you have ${lengthOfAllDishes} dishes in your list`
                : 'you have no any dishes... change it!'
            }
          </Typography>

          <Cards
            deleteDish={this.deleteDish}
            allDishes={dishListForRender}
          />
          {
            allDishes.length
              ? (
                <Pagination
                  count={allPages}
                  page={currentPage}
                  onChange={this.handleChangeCurrentPage}
                />
              )
              : ''
          }
        </div>
      </div>
    );
  }
}

export default Dishes;
