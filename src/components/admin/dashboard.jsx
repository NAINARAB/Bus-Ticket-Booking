import './admin.css';
import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { CircularProgress } from '@mui/material';
import { supabase } from '../../supabase';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [buses, setBuses] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [trips, setTrips] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [users, setUsers] = useState(null);
    useEffect(() => {
        if (isAdmin) {
            counts();
        }
    }, [])

    async function counts() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('buses')
                    .select('pk')
                if (data) {
                    setBuses(data.length)
                }
            } catch (e) { }
            try {
                const { data, error } = await supabase
                    .from('routes')
                    .select('pk')
                if (data) {
                    setRoutes(data.length)
                }
            } catch (e) { }
            try {
                const { data, error } = await supabase
                    .from('trip')
                    .select('pk')
                    .eq('status', false)
                if (data) {
                    setTrips(data.length)
                }
            } catch (e) { }
            try {
                const { data, error } = await supabase
                    .from('seats')
                    .select('pk')
                if (data) {
                    setBookings(data.length)
                }
            } catch (e) { }
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('pk')
                    .eq('type', false)
                if (data) {
                    setUsers(data.length)
                }
            } catch (e) { }
        }
    }
    const isAdmin = Boolean(sessionStorage.getItem('isadmin'));
    return (
        <React.Fragment>
            <Header status={true} />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"admin"} current={'dashboard'} />
                </div>

                <div className='col-lg-10' style={{ padding: '2em' }}>
                    {isAdmin === true ?
                        <>
                            <div className='cont'>
                                <div className='dis'>
                                    <center>
                                        <h1>{buses !== null ? buses : <CircularProgress />}</h1>
                                        <h2>Total Buses</h2>
                                    </center>
                                </div>
                                <div className='dis'>
                                    <center>
                                        <h1>{routes !== null ? routes : <CircularProgress />}</h1>
                                        <h2>Routes</h2>
                                    </center>
                                </div>
                                <div className='dis'>
                                    <center>
                                        <h1>{trips !== null ? trips : <CircularProgress />}</h1>
                                        <h2>Trips</h2>
                                    </center>
                                </div>
                                <div className='dis'>
                                    <center>
                                        <h1>{bookings !== null ? bookings : <CircularProgress />}</h1>
                                        <h2>Bookings</h2>
                                    </center>
                                </div>
                                <div className='dis'>
                                    <center>
                                        <h1>{users !== null ? users : <CircularProgress />}</h1>
                                        <h2>Customers</h2>
                                    </center>
                                </div>
                            </div>
                        </>
                        : <h2>Please Login <Link to={`/login/${false}`}>Go To Login Page</Link></h2>}

                </div>
            </div>
        </React.Fragment>
    )
}

export default AdminDashboard;