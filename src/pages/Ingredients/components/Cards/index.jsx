import React, {
  PureComponent,
} from 'react';
import { PropTypes } from 'prop-types';

import {
  Card,
  Button,
  Typography,
  CardContent,
  CardActions,
} from '@material-ui/core';

class Cards extends PureComponent {
  render() {
    const {
      props: {
        allIngredients,
        deleteIngredient,
      },
    } = this;

    return (
      <>
        {allIngredients
          ? allIngredients.map(({
            id,
            name,
            gramsTotal,
            calloriesTotal,
            calloriesIn100Grams,
          }) => (
            <Card
              key={id}
              className="ingredient__card"
            >
              <CardContent className="ingredient__card-discription">
                <div>
                  <Typography
                    variant="h5"
                    gutterBottom
                    component="h2"
                  >
                    {name}
                  </Typography>
                  <Typography
                    component="p"
                    variant="body2"
                    color="textSecondary"
                  >
                    {calloriesIn100Grams}
                    {' '}
                    call X
                    {gramsTotal}
                    {' '}
                    g =
                    {calloriesTotal}
                    {' '}
                    call
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => { deleteIngredient(id); }}
                >
                  delete ingrededient
                </Button>
              </CardActions>
            </Card>
          )) : ''}
      </>
    );
  }
}

Cards.propTypes = {
  deleteIngredient: PropTypes.func.isRequired,
  allIngredients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Cards;
