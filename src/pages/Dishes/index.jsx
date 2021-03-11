import React, { PureComponent } from 'react';
import {
  Button,
  TextField,
} from '@material-ui/core';

import Cards from './components/Cards';
import Navbar from '../../components/Navbar';

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
      },
    };

    this.addDish = this.addDish.bind(this);
    this.deleteDish = this.deleteDish.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      currentDish: { ...this.state.currentDish, [name]: value }
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
        }
      })
    }
  };

  deleteDish(idOfCurrentDish) {
    const updateAllDishes = this.state.allDishes.filter(({ id }) => id !== idOfCurrentDish);
    this.setState({
      allDishes: updateAllDishes,
    });
  };

  render() {
    const { state: { currentDish: { name, discription }, allDishes } } = this;
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

          <Cards allDishes={allDishes} />
        </div>
      </div>
    )
  }
};

export default Dishes;
