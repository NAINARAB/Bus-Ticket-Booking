import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { supabase } from '../../supabase';
import SearchIcon from '@mui/icons-material/Search';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Alr from '../alert/alert';
import './user.css';
import pushActivity from '../activity/activitypush';

const MyTickets = () => {
    const isUser = Boolean(sessionStorage.getItem('isuser'));
    const userPK = parseInt(sessionStorage.getItem('pkuser'));
    const [delUser, setDelUser] = useState('');
    const [searchdata, setSearchdata] = useState('');
    const [fet, setFet] = useState(false);
    const [alert, setAlert] = useState({});
    const [pk, setPK] = useState();
    const [open, setOpen] = useState(false);
    const [resp, setResp] = useState([]);
    const [tripsPk, setTripsPk] = useState([]);

    useEffect(() => {
        if (isUser) {
            Mytrip();
        }
    }, [fet])

    async function Mytrip() {
        if (isUser) {
            try {
                const { data, error } = await supabase
                    .from('seats')
                    .select(`*,
                            trip: trip_id (*,
                                bus: bus_pk (*),
                                route: route_pk (*))`)
                    .eq('user_id', userPK)
                if (error) {
                    setResp([]);
                }
                if (data) {
                    setTripsPk([...new Set(data.map(obj => obj.trip_id))]);

                    setResp(data);
                    for (let i = 0; i < data.length; i++) {
                        let value = data[i].trip.route.ticket_price
                        let value1 = data[i].trip.route.total_km
                    }
                }
            } catch (e) { }
        }
    }

    async function pushNotification() {
        try {
            const { data, error } = await supabase
                .from('notification')
                .insert([{
                    'user_id': parseInt(userPK),
                    'message': "Ticket Canceled for " + delUser,
                    'to_all_status': false
                }])
                .select()
                if(data){}if(error){}
        } catch (e) { }
    }
    //you have not booked any receipt yet
    async function cancelTicket() {
        if (isUser) {
            try {
                const { error } = await supabase
                    .from('seats')
                    .delete()
                    .eq('pk', pk)
                if (error) {
                    setAlert({
                        'dispalr': true, 'alrstatus': false, 'close': setAlert,
                        'alrmes': error.message || error.details
                    })
                } else {
                    setAlert({
                        'dispalr': true, 'alrstatus': true, 'close': setAlert,
                        'alrmes': 'Ticket Canceled'
                    }); pushNotification(); setOpen(false); setFet(!fet);  
                }pushActivity(`Tichet Canceled By User&{pk}`)
            } catch (e) { }
        }
    }

    function TicketDownload(obj) {
        const data = {
            'Name': obj.passenger_name,
            'Age': obj.passenger_age,
            'SeatNo': obj.seat_no,
            'Amount': obj.trip.route.ticket_price,
            'From': obj.trip.route.start_point,
            'To': obj.trip.route.end_point,
            'Trip_Start_Time': obj.trip.start_time,
            'Trip_End_Time': obj.trip.end_time,
            'Day': obj.trip.day
        }
        const Datas = JSON.stringify(data, null, 2);
        const blob = new Blob([Datas], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ticket.txt';
        link.click();
        URL.revokeObjectURL(url);
        pushNotification(`Ticket Downloaded ${obj.passenger_name}`)
    }

    return (
        <React.Fragment>
            {alert.dispalr === true && <Alr value={alert} />}
            <Header status={true} />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"user"} current={'mytickets'} />
                </div>
                <div className='col-lg-10'>

                    <div className="search">
                        <input type={'search'} className='micardinpt'
                            placeholder="Search.. Passenger, Place, SeatNo, Amount"
                            onChange={(e) => {
                                setSearchdata((e.target.value).toLowerCase());
                            }}
                            style={{ paddingLeft: '3em' }} />
                        <div className="sIcon">
                            <SearchIcon sx={{ fontSize: '2em' }} />
                        </div>
                    </div><br /><br /><br />

                    <div className='spaces'>
                        <div className='cont'>
                            {resp.length !== 0 ?
                                searchdata === '' ?
                                    resp.map(obj => (
                                        <div className='dis'>
                                            <h5 style={{ textAlign: 'center' }}>
                                                <span style={{ float: 'left' }}>{obj.trip.route.start_point}</span>
                                                <span><LocalActivityIcon /></span>
                                                <span style={{ float: 'right' }}>{obj.trip.route.end_point}</span>
                                            </h5>
                                            <p style={{ float: 'unset', textAlign: 'center' }}>
                                                <span style={{ float: 'left' }}>{obj.trip.start_time}</span>
                                                <span style={{ float: 'right' }}>{obj.trip.end_time}</span>
                                            </p><br />
                                            Day:   <p>{obj.trip.day}</p><br />
                                            Name   <p style={{ color: 'green', fontWeight: 'bold' }}>
                                                {obj.passenger_name}</p><br />
                                            Age    <p>{obj.passenger_age}</p><br />
                                            SeatNo <p>{obj.seat_no}</p><br />
                                            Amount <p>{obj.trip.route.ticket_price}</p><br />
                                            <Button variant='outlined'
                                                sx={{ width: '100%', margin: '3px 0' }} onClick={() => {
                                                    TicketDownload(obj);
                                                }}>
                                                <FileDownloadIcon /> &nbsp;Download Ticket
                                            </Button>
                                            <Button sx={{ width: '100%', margin: '3px 0' }} color="error" variant='outlined'
                                                onClick={() => { setPK(obj.pk); setDelUser(obj.passenger_name); setOpen(true); }}>Cancel Ticket
                                            </Button>
                                        </div>
                                    )) :
                                    <>
                                        {resp.map(obj => (
                                            (obj.trip.route.start_point.toLowerCase()).includes(searchdata) ||
                                                (obj.trip.route.end_point.toLowerCase()).includes(searchdata) ||
                                                (obj.passenger_name.toLowerCase()).includes(searchdata) ||
                                                (obj.seat_no.toString()).includes(searchdata) ||
                                                (obj.trip.route.ticket_price.toString()).includes(searchdata) ?
                                                <div className='dis'>
                                                    <h5 style={{ textAlign: 'center' }}>
                                                        <span style={{ float: 'left' }}>{obj.trip.route.start_point}</span>
                                                        <span><LocalActivityIcon /></span>
                                                        <span style={{ float: 'right' }}>{obj.trip.route.end_point}</span>
                                                    </h5>
                                                    <p style={{ float: 'unset', textAlign: 'center' }}>
                                                        <span style={{ float: 'left' }}>{obj.trip.start_time}</span>
                                                        <span style={{ float: 'right' }}>{obj.trip.end_time}</span>
                                                    </p><br />
                                                    Day:   <p>{obj.trip.day}</p><br />
                                                    Name   <p style={{ color: 'green', fontWeight: 'bold' }}>
                                                        {obj.passenger_name}</p><br />
                                                    Age    <p>{obj.passenger_age}</p><br />
                                                    SeatNo <p>{obj.seat_no}</p><br />
                                                    Amount <p>{obj.trip.route.ticket_price}</p><br />
                                                    <Button variant='outlined'
                                                        sx={{ width: '100%', margin: '3px 0' }} onClick={() => {
                                                            TicketDownload(obj);
                                                        }}>
                                                        <FileDownloadIcon /> &nbsp;Download Ticket
                                                    </Button>
                                                    <Button sx={{ width: '100%', margin: '3px 0' }} color="error" variant='outlined'
                                                        onClick={() => { setPK(obj.pk); setDelUser(obj.passenger_name); setOpen(true); }}>Cancel Ticket
                                                    </Button>
                                                </div> : null
                                        ))}
                                    </>
                                : <h3>You have not booked any receipt yet</h3>}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b style={{ color: 'black', padding: '0px 20px' }}>Do you Want to Cancel this Ticket?</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={cancelTicket} autoFocus sx={{ color: 'red' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default MyTickets;