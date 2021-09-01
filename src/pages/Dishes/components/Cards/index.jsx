import React, {
  PureComponent,
} from 'react';
import { PropTypes } from 'prop-types';

import {
  Link,
  Card,
  Button,
  Tooltip,
  Typography,
  CardActions,
  CardContent,
} from '@material-ui/core';

import '../../index.scss';

class Cards extends PureComponent {
  render() {
    const {
      props: {
        allDishes,
        deleteDish,
      },
    } = this;
    return (
      <>
        {
          allDishes
            ? allDishes.map(({
              id,
              name,
              weight,
              callories,
              discription,
            }) => (
              <Card
                key={id}
                className="dish__card"
              >
                <CardContent className="dish__card-discription">
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
                      {discription}
                    </Typography>
                  </div>
                  <div className="dish__weight-info">
                    <Tooltip
                      title="callories"
                      aria-label="callories"
                    >
                      <div>
                        {' '}
                        {Math.ceil(callories)}
                        {' '}
                        call
                        {' '}
                      </div>
                    </Tooltip>
                    <Tooltip
                      title="weight"
                      aria-label="weight in grams"
                    >
                      <div>
                        {' '}
                        {weight}
                        {' '}
                        g
                        {' '}
                      </div>
                    </Tooltip>
                    <Tooltip
                      title="call in 100g"
                      aria-label="call in 100g"
                    >
                      <div>
                        {' '}
                        {Math.ceil((callories / weight) * 100) || 0}
                        {' '}
                        call
                        {' '}
                      </div>
                    </Tooltip>
                  </div>
                </CardContent>
                <CardActions>
                  <Link href={`/${id}`}>
                    <Button
                      size="small"
                      color="primary"
                    >
                      open ingrededients
                    </Button>
                  </Link>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => { deleteDish(id); }}
                  >
                    delete
                  </Button>
                </CardActions>
              </Card>
            ))
            : ''
        }
      </>
    );
  }
}

Cards.propTypes = {
  allDishes: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteDish: PropTypes.func.isRequired,
};

export default Cards;
