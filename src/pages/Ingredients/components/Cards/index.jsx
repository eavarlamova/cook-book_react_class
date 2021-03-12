import React, { PureComponent } from 'react';

import {
  Link,
  Card,
  Button,
  Tooltip,
  Typography,
  CardContent,
  CardActions,
} from '@material-ui/core';

class Cards extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { props: {
      allIngredients,
      deleteIngredient,
    }
    } = this;
    return (
      <>
        {allIngredients ?
          allIngredients.map(({ id, name, calloriesIn100Grams, gramsTotal, calloriesTotal }) => (
            <Card className='ingredient__card' key={id}>

              <CardContent className="ingredient__card-discription">
                <div>
                  <Typography gutterBottom variant="h5" component="h2">
                    {name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {calloriesIn100Grams} call X {gramsTotal} g = {calloriesTotal} call
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
                <Link href={`/${id}`}>
                  {/* <Button size="small" color="primary">
                open ingrededients
                        </Button> */}
                </Link>
                <Button size="small" color="primary" onClick={() => { deleteIngredient(id) }}
                >
                  delete ingrededient
                    </Button>
              </CardActions>
            </Card>
          )) : ''
        }
      </>
    )
  }
}

export default Cards;