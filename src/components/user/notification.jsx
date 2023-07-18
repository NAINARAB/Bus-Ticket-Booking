import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { supabase } from '../../supabase';
import { Alert } from '@mui/material';

const UserNotification = () => {
    const [notification, setNotification] = useState([]);
    const isUser = Boolean(sessionStorage.getItem('isuser'));
    const UserPK = parseInt(sessionStorage.getItem('pkuser'));

    useEffect(()=>{
        if(isUser){
            fetchNotification()
        }
    },[])

    async function fetchNotification() {
        if (isUser) {
            try {
                const { data, error } = await supabase
                    .from('notification')
                    .select('*')
                    .or('to_all_status.eq.true, user_id.eq.' + UserPK)
                if (error) { }
                if (data) {
                    setNotification(data)
                }
            } catch (e) { }
            
        }
    }
    return (
        <React.Fragment>
            <Header status={true} />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"user"} current={'notification'} />
                </div>
                <div className='col-lg-10'>
                    <div className='spaces'>
                        <h3>Personal Notifications</h3>
                        <hr />
                        <div className='cont'>
                            {notification.length !== 0
                                ? notification.map(obj => (
                                    obj.to_all_status === false ?
                                    <Alert sx={{width:'100%',maxWidth:'380px'}} severity='info'>
                                        {obj.message}
                                    </Alert> : null))
                                : <h3>Not Available</h3>
                            }
                        </div><br /><br /><br />
                        <h3>Gendral Notifications</h3>
                        <hr />
                        <div className='cont'>
                            
                            {notification.length !== 0
                                ? notification.map(obj => (
                                    obj.to_all_status === true ?
                                    <Alert sx={{width:'100%',maxWidth:'380px'}} severity='info'>
                                        {obj.message}
                                    </Alert> : null))
                                : <h3>Not Available</h3>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserNotification;