import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { supabase } from '../../supabase';
import SearchIcon from '@mui/icons-material/Search';
import './admin.css';
import { Link } from 'react-router-dom';
import Alr from '../alert/alert';
const Bookings = () => {
    const [allBooking, setAllBooking] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchdata, setSearchdata] = useState('');
    const [fet, setFet] = useState(false);
    const [pk, setPK] = useState();
    const [alert, setAlert] = useState({});

    const [userName, setUserName] = useState('');
    const [userid, setUserId] = useState();

    const isAdmin = Boolean(sessionStorage.getItem('isadmin'));
    const adminPk = parseInt(sessionStorage.getItem('pkadmin'))

    useEffect(() => {
        if (isAdmin) {
            fetchBooking();
        }
    }, [fet])

    async function fetchBooking() {
        try {
            const { data, error } = await supabase
                .from('seats')
                .select(`*,
                            trip: trip_id (*,
                            bus: bus_pk (*),
                            route: route_pk (*))`)
            if (error) { }
            if (data) { setAllBooking(data) }
        } catch (e) { }
        try {
            const {data} = await supabase
            .from('activity')
            .insert([{
                'event': `Fetched Data From seats By ${adminPk}` 
            }])
            if(data){}
        }catch(e){}
    }

    async function DeleteBooking() {
        if (isAdmin) {
            try {
                const { error } = await supabase
                    .from('seats')
                    .delete()
                    .eq('pk', pk)
                if (error) { 
                    setAlert({
                        'dispalr': true,
                        'alrstatus': false,
                        'close': setAlert,
                        'alrmes': error.message || error.details
                    });
                 }else{
                    setAlert({
                        'dispalr': true,
                        'alrstatus': false,
                        'close': setAlert,
                        'alrmes': error.message || error.details
                    });setOpen(false);setFet(!fet);
                    try {
                        const {data,error} = await supabase
                        .from('notification')
                        .insert([{
                            'user_id': userid,
                            'message': `Sorry Ticket Canceled for ${userName} By Admin`,
                            'to_all_status': false
                        }])
                        .select()
                        if(error){}
                        if(data){}
                    }catch(e){}
                 }
                 try {
                    const {data} = await supabase
                    .from('activity')
                    .insert([{
                        'event': `Booking Deleteded By ${adminPk}` 
                    }])
                    if(data){}
                }catch(e){}
            } catch (e) { }
        }
    }

    function setDelete(arg){
        setPK(arg.pk);
        setUserId(arg.user_id)
        setUserName(arg.passenger_name)
        setOpen(true)
    }



    return (
        <React.Fragment>
            {alert.dispalr === true && <Alr value={alert} />}
            <Header status={true} />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"admin"} current={'bookings'} />
                </div>
                <div className='col-lg-10'>

                    <div className="search">
                        <input type={'search'} className='micardinpt'
                            placeholder="Search.. Passenger, Place, SeatNo"
                            onChange={(e) => {
                                setSearchdata((e.target.value).toLowerCase());
                            }}
                            style={{ paddingLeft: '3em' }} />
                        <div className="sIcon">
                            <SearchIcon sx={{ fontSize: '2em' }} />
                        </div>
                    </div><br /><br /><br />

                    {isAdmin === true ?

                        <div className='spaces'>
                            {allBooking.length !== 0 ?
                                searchdata === '' ?
                                    allBooking.map(obj => (
                                        <div className='booked'>
                                            <div className='sec'>
                                                <h3>Passenger Info </h3>
                                                <h5>
                                                    <span style={{ float: 'left' }}>Name:</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.passenger_name}</span>
                                                </h5><br />
                                                <h5>
                                                    <span style={{ float: 'left' }}>Age :</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.passenger_age}</span>
                                                </h5><br />
                                                <h5>
                                                    <span style={{ float: 'left' }}>Seat No:</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.seat_no}</span>
                                                </h5><br />
                                            </div>
                                            <div className='rule'></div>
                                            <div className='sec'>
                                                <h3>Trip Info </h3>
                                                <h5>
                                                    <span style={{ float: 'left' }}>From</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.trip.route.start_point}</span>
                                                </h5><br />
                                                <h5>
                                                    <span style={{ float: 'left' }}>To</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.trip.route.end_point}</span>
                                                </h5><br />
                                                <h5>
                                                    <span style={{ float: 'left' }}>date</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.trip.day}</span>
                                                </h5><br />
                                            </div>
                                            <div className='rule'></div>
                                            <div className='sec'>
                                                <h3>Bus Info </h3>
                                                <h5>
                                                    <span style={{ float: 'left' }}>Bus No</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.trip.bus.bus_no}</span>
                                                </h5><br />
                                                <h5>
                                                    <span style={{ float: 'left' }}>Bus Code:</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.trip.bus.bus_code}</span>
                                                </h5><br />
                                                <h5>
                                                    <span style={{ float: 'left' }}>Total Seat</span>
                                                    <span style={{ float: 'right', color: 'blue' }}>{obj.trip.bus.capacity}</span>
                                                </h5><br />
                                            </div>
                                            <div className='secful'>
                                                <button
                                                    onClick={() => { setDelete(obj) }}
                                                    className='btn btn-danger'>
                                                    Cancel This Booking
                                                </button>
                                            </div>
                                        </div>
                                    )) :
                                    <React.Fragment>
                                        {allBooking.map(obj => (
                                            (obj.passenger_name.toLowerCase()).includes(searchdata) ||
                                                (obj.passenger_age.toString()).includes(searchdata) ||
                                                (obj.seat_no.toString()).includes(searchdata) ||
                                                (obj.trip.route.start_point.toLowerCase()).includes(searchdata) ||
                                                (obj.trip.route.end_point.toLowerCase()).includes(searchdata) ||
                                                (obj.trip.bus.bus_no.toLowerCase()).includes(searchdata) ||
                                                (obj.trip.bus.bus_code.toLowerCase()).includes(searchdata) ?
                                                <div className='booked'>
                                                    <div className='sec'>
                                                        <h3>Passenger Info </h3>
                                                        <h5>
                                                            <span style={{ float: 'left' }}>Name:</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.passenger_name}</span>
                                                        </h5><br />
                                                        <h5>
                                                            <span style={{ float: 'left' }}>Age :</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.passenger_age}</span>
                                                        </h5><br />
                                                        <h5>
                                                            <span style={{ float: 'left' }}>Seat No:</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.seat_no}</span>
                                                        </h5><br />
                                                    </div>
                                                    <div className='rule'></div>
                                                    <div className='sec'>
                                                        <h3>Trip Info </h3>
                                                        <h5>
                                                            <span style={{ float: 'left' }}>From</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.trip.route.start_point}</span>
                                                        </h5><br />
                                                        <h5>
                                                            <span style={{ float: 'left' }}>To</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.trip.route.end_point}</span>
                                                        </h5><br />
                                                        <h5>
                                                            <span style={{ float: 'left' }}>date</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.trip.day}</span>
                                                        </h5><br />
                                                    </div>
                                                    <div className='rule'></div>
                                                    <div className='sec'>
                                                        <h3>Bus Info </h3>
                                                        <h5>
                                                            <span style={{ float: 'left' }}>Bus No</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.trip.bus.bus_no}</span>
                                                        </h5><br />
                                                        <h5>
                                                            <span style={{ float: 'left' }}>Bus Code:</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.trip.bus.bus_code}</span>
                                                        </h5><br />
                                                        <h5>
                                                            <span style={{ float: 'left' }}>Total Seat</span>
                                                            <span style={{ float: 'right', color: 'blue' }}>{obj.trip.bus.capacity}</span>
                                                        </h5><br />
                                                    </div>
                                                    <div className='secful'>
                                                        <button
                                                            onClick={() => { setDelete(obj) }}
                                                            className='btn btn-danger'>
                                                            Cancel This Booking
                                                        </button>
                                                    </div>
                                                </div>
                                                : null))}
                                    </React.Fragment>
                                : <h2>Currently No Bookings</h2>}
                        </div>
                        : <h2>Please Login <Link to={`/login/${false}`}>Go To Login Page</Link></h2>}
                </div>
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Cancelation
                </DialogTitle>
                <DialogContent>
                    <b>Do you want to Cancel this Booking</b>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'red' }}>Cancel</Button>
                    <Button onClick={DeleteBooking} autoFocus color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default Bookings;