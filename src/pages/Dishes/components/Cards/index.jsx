import React, { PureComponent } from 'react';

import {
  Link,
  Card,
  Button,
  Typography,
  CardActions,
  CardContent,
  Tooltip,
} from '@material-ui/core';

import '../../index.scss';

class Cards extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { props: { allDishes, deleteDish } } = this;
    return (
      <>
        {
          allDishes
            ?
            allDishes.map(({ id, name, discription, callories }) => (
              <Card className='dish__card' key={id}>

                <CardContent className="dish__card-discription">
                  <div>
                    <Typography gutterBottom variant="h5" component="h2">
                      {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {discription}
                    </Typography>
                  </div>
                  <Tooltip title='callories' aria-label='callories'>
                    <div> {callories} </div>
                  </Tooltip>
                </CardContent>
                <CardActions>
                  <Link href={`/${id}`}>
                    <Button size="small" color="primary">
                      open ingrededients
                                        </Button>
                  </Link>
                  <Button size="small" color="primary" onClick={() => { deleteDish(id) }}>
                    delete
                                    </Button>
                </CardActions>
              </Card>
            ))
            :
            ''
        }
      </>
    )
  }
}

export default Cards;