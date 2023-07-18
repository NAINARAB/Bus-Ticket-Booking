import React, {useState, useEffect} from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import Home from '../home';
import './user.css';

const UserSearchBus = () => {
    return(
        <React.Fragment>
            {/* <Header status={true}/> */}
            <div className='row'>
                <div className='col-lg-2' style={{marginTop:'4.50em'}}>
                    <Sidenav user={"user"} current={'searchbus'}/>
                </div>
                <div className='col-lg-10'>
                    <div className='dont'>
                        <Home />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserSearchBus;