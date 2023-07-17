import React, {useState, useEffect} from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';

const UserNotification = () => {
    return(
        <React.Fragment>
            <Header status={true}/>
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"user"} current={'notification'}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserNotification;