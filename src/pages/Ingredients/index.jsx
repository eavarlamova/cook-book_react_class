import React, { PureComponent } from 'react';
import Navbar from '../../components/Navbar';

class Ingredients extends PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <>
            <Navbar> ingredients </Navbar>
                Welcome to Ingredients
            </>
        )
    }
};

export default Ingredients;
