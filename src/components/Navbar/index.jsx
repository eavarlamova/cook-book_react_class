import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';

import {
  Link,
  AppBar,
  Toolbar,
} from '@material-ui/core/';

import './index.scss';

class Navbar extends PureComponent {
  render() {
    const { props: { children } } = this;
    return (
      <div className="navbar">
        <AppBar position="static">
          <Toolbar className="navbar__content">
            <>
              It is your
              {children}
            </>
            {
              children.trim() !== 'dishes'
                ? (
                  <Link
                    href="/"
                    color="inherit"
                  >
                    look dishes
                  </Link>
                )
                : ''
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Navbar;
