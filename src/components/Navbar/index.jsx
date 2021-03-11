import React, { PureComponent }  from 'react';

import { AppBar, Toolbar, Link } from '@material-ui/core/';

import "./index.scss";

class Navbar extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="navbar">
                <AppBar position="static">
                    <Toolbar className="navbar__content">
                        <>It's your {this.props.children}</>
                        {this.props.children.trim() !== 'dishes' ? <Link href="/" color="inherit"> look dishes</Link> : ''}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Navbar;