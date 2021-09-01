import React, {
  PureComponent,
} from 'react';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

import Dishes from './pages/Dishes';
import Ingredients from './pages/Ingredients';

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Dishes} exact />
          <Route path="/:id" component={Ingredients} exact />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
