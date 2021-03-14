import React, { PureComponent } from 'react';

import {
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { MAX_CARDS_ON_PAGE, ENTER } from '../../utils/constants';
import Cards from './components/Cards';
import Navbar from '../../components/Navbar';
import { getDataFromLS, setDataToLS } from '../../utils/localStorageMethods';
import { getListForRender, getPagesLength, normolizeCurrentPage } from '../../utils/getTempValue';
import "./index.scss";

class Dishes extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      allDishes: [],
      currentDish: {
        id: Math.random(),
        name: '',
        discription: '',
        callories: 0,
        weight: 0,
      },
      currentPage: 1,
    };

    this.addDish = this.addDish.bind(this);
    this.deleteDish = this.deleteDish.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
  };

  componentDidMount() {
    this.setState({
      allDishes: getDataFromLS('allDishes')
    })
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      currentDish: { ...this.state.currentDish, [name]: value }
    })
  };

  handleChangeCurrentPage(event, newCurrentPage) {
    this.setState({
      currentPage: newCurrentPage,
    })
  };

  addDish() {
    const { state: { currentDish, allDishes } } = this;
    if (currentDish.name.trim() && currentDish.discription.trim()) {
      this.setState({
        allDishes: [
          ...allDishes,
          {
            ...currentDish,
            name: currentDish.name.trim(),
            discription: currentDish.discription.trim(),
          }
        ],
        currentDish: {
          id: Math.random(),
          name: '',
          discription: '',
          callories: 0,
          weight: 0,
        },
      }, () => {
        const { state: { allDishes } } = this;
        setDataToLS('allDishes', allDishes);
        this.handleChangeCurrentPage(null, getPagesLength(allDishes));
      })
    }
  };

  deleteDish(idOfCurrentDish) {
    const updateAllDishes = this.state.allDishes.filter(({ id }) => id !== idOfCurrentDish);
    this.setState({
      allDishes: updateAllDishes,
    }, () => {
      const { state: { allDishes, currentPage } } = this;
      this.setState({
        currentPage: normolizeCurrentPage(allDishes, currentPage)
      })
      setDataToLS('allDishes', allDishes)
      const allIngredients = getDataFromLS('allIngredients').filter(({ dishId }) => (Number(dishId) !== idOfCurrentDish));
      setDataToLS('allIngredients', allIngredients);
    });
  };


  render() {
    const {
      state: {
        currentDish: {
          name,
          discription
        },
        allDishes,
        currentPage,
      }
    } = this;

    const dishListForRender = getListForRender(allDishes, currentPage);
    const lengthOfAllDishes = allDishes.length;
    const allPages = getPagesLength(allDishes);

    return (
      <div className="dish">
        <Navbar> dishes </Navbar>
        <div className="dish__add-form">
          <TextField
            name="name"
            value={name}
            onChange={this.handleChange}
            label="add name dish"
            fullWidth
          />
          <TextField
            name="discription"
            value={discription}
            onChange={this.handleChange}
            label="add discription dish"
            fullWidth
            multiline
          />
          <Button
            onClick={this.addDish}
            color="primary"
            variant="contained"
            fullWidth
          >
            add dish
          </Button>

          <Typography color='textSecondary'>
            {
              lengthOfAllDishes
                ?
                `you have ${lengthOfAllDishes} dishes in your list`
                :
                'you have no any dishes... change it!'
            }
          </Typography>

          <Cards allDishes={dishListForRender} deleteDish={this.deleteDish} />
          {
            allDishes.length
              ?
              <Pagination count={allPages} page={currentPage} onChange={this.handleChangeCurrentPage} />
              :
              ''
          }
        </div>
      </div>
    )
  }
};

export default Dishes;
