import React, {useState, useEffect} from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';

const Bookings = () => {
    return(
        <React.Fragment>
            <Header status={true}/>
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"admin"} current={'bookings'}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Bookings;