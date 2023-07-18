import './user.css';
import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { CircularProgress } from '@mui/material';
import { supabase } from '../../supabase';

const UserDashboard = () => {
    const [totalTrips, setTotalTrips] = useState(null);
    const [totalTickets, setTotalTickets] = useState(null);
    const [totalBill, setTotalBill] = useState(null);
    const [totalKm, setTotalKm] = useState(null);
    const isUser = Boolean(sessionStorage.getItem('isuser'));
    const userPK = parseInt(sessionStorage.getItem('pkuser'));

    useEffect(()=>{
        Mytrip();
    },[])

    async function Mytrip(){
        if(isUser){
            try {
                const { data, error } = await supabase
                    .from('seats')
                    .select(`*,
                            trip: trip_id (*,
                                bus: bus_pk (*),
                                route: route_pk (*))`)
                    .eq('user_id', userPK)
                if (error) {
                    setTotalBill(0);setTotalTickets(0);
                    setTotalTrips(0);setTotalKm(0);
                }
                if (data) {
                    let temp = 0;
                    let trip = [...new Set(data.map(obj => obj.trip_id))]
                    let km = 0;
                    for(let i = 0; i<data.length; i++){
                        let value = data[i].trip.route.ticket_price
                        let value1 = data[i].trip.route.total_km
                        temp = parseInt(temp) + parseInt(value)
                        km = parseInt(km) + parseInt(value1)
                    }
                    console.log(trip);
                    setTotalBill(parseInt(temp));setTotalTickets(data.length);
                    setTotalTrips(trip.length);setTotalKm(km);
                }
            } catch (e) {}
        }
    }
    return (
        <React.Fragment>
            <Header status={true} />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"user"} current={'dashboard'} />
                </div>
                <div className='col-lg-10' style={{ padding: '2em' }}>
                    <div className='cont'>
                        <div className='dis'>
                            <center>
                                <h1>{totalTrips !== null ? totalTrips : <CircularProgress />}</h1>
                                <h2>Total Trips</h2>
                            </center>
                        </div>
                        <div className='dis'>
                            <center>
                                <h1>{totalTickets !== null ? totalTickets : <CircularProgress />}</h1>
                                <h2>Total Tickets</h2>
                            </center>
                        </div>
                        <div className='dis'>
                            <center style={{marginTop:'1.9em'}}>
                                <h1 style={{fontSize:'50px'}}>{totalKm !== null ? totalKm : <CircularProgress />}</h1>
                                <h2>Total KiloMeters</h2>
                            </center>
                        </div>
                        <div className='dis'>
                            <center style={{marginTop:'1.9em'}}>
                                <h1 style={{fontSize:'50px'}}>{totalBill !== null ? totalBill + " ₹" : <CircularProgress />}</h1>
                                <h2>Bills Payable</h2>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserDashboard;