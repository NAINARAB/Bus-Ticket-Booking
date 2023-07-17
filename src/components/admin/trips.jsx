import './admin.css';
import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { supabase } from '../../supabase';
import Alr from '../alert/alert';
import DialogBox from '../DialogBox/dialog';


const Trips = () => {
    const [trip, setTrip] = useState([]);
    const [pk, setPK] = useState();
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [day, setDay] = useState();
    const [bus, setBus] = useState();
    const [buses, setBuses] = useState([]);
    const [route, setRoute] = useState();
    const [routes, setRoutes] = useState([]);
    const [status, setStatus] = useState(false);

    const [getBus, setGetBus] = useState('');
    const [getRoute, setGetRoute] = useState('');

    const [searchdata, setSearchdata] = useState('');
    const [edit, setEdit] = useState(false);
    const [alert, setAlert] = useState({});
    const [dialogobj, setDialogObj] = useState({});
    const [refresh, setRefresh] = useState(false);
    const isAdmin = Boolean(sessionStorage.getItem('isadmin'));
    const [dialog, setDialog] = useState(false);
    const close = () => { setDialog(false); setEdit(false) };
    const doRefresh = () => setRefresh(!refresh);

    useEffect(() => {
        fetchTrip();
    }, [refresh])

    async function fetchTrip() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('trip')
                    .select(`*,
                        bus: bus_pk (*),
                        route: route_pk (*)`)
                    .eq('status', false)
                if (data !== null) {
                    setTrip(data);
                }
            } catch (e) { console.log(e) }
            try {
                const { data, error } = await supabase
                    .from('buses')
                    .select('*')
                if (error) throw console.log(error)
                if (data !== null) {
                    setBuses(data)
                }
            } catch (e) { console.log(e) }
            try {
                const { data, error } = await supabase
                    .from('routes')
                    .select('*')
                if (data !== null) {
                    setRoutes(data);
                }
            } catch (e) { console.log(e) }
        }
    }

    async function insertTrip() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('trip')
                    .insert([{
                        'start_time': start,
                        'end_time': end,
                        'day': day,
                        'bus_pk': bus,
                        'route_pk': route,
                        'status': false
                    }])
                if (error) {
                    setAlert({
                        'dispalr': true, 'alrstatus': false, 'close': setAlert,
                        'alrmes': error.message || error.details
                    })
                } else {
                    setAlert({
                        'dispalr': true, 'alrstatus': true, 'close': setAlert,
                        'alrmes': "New Trip Added"
                    }); setDialog(false); setRefresh(!refresh);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function updateTrip() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('trip')
                    .update([{
                        'start_time': start,
                        'end_time': end,
                        'day': day,
                        'bus_pk': bus,
                        'route_pk': route,
                        'status': status
                    }])
                    .eq('pk', pk)
                if (error) {
                    setAlert({
                        'dispalr': true, 'alrstatus': false, 'close': setAlert,
                        'alrmes': error.message || error.details
                    })
                } else {
                    setAlert({
                        'dispalr': true, 'alrstatus': true, 'close': setAlert,
                        'alrmes': "Trip Updated"
                    }); doRefresh(); close();
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    function setUpdate(arg) {
        setEdit(true);
        setDialog(true);
        setPK(arg.pk);
        setStart(arg.start_time); setEnd(arg.end_time); setDay(arg.day);
        setBus(arg.bus_pk); setRoute(arg.route_pk); setStatus(arg.status);
        setGetBus(arg.bus.bus_code); setGetRoute(arg.route.start_point + ' To ' + arg.route.end_point);
    }
    function closeDelete() {
        setDialogObj({ 'open': false })
    }
    function setDelete(arg) {
        setDialogObj({
            'open': true,
            'pk': arg.pk,
            'table': 'routes',
            'refresh': doRefresh,
            'close': closeDelete
        });
    }

    return (
        <React.Fragment>
            {alert.dispalr === true && <Alr value={alert} />}
            {dialogobj.open === true && <DialogBox value={dialogobj} />}
            <Header status={true} />
            <div className='row'>

                <div className='col-lg-2'>
                    <Sidenav user={"admin"} current={'trips'} />
                </div>

                <div className='col-lg-10'>
                    <div className='spaces'>
                        {isAdmin === true ?
                            <React.Fragment>
                                <Button
                                    color="secondary"
                                    variant='outlined'
                                    onClick={() => setDialog(true)}>
                                    Make Trip
                                </Button><br /><br />

                                {trip.length !== 0 ?
                                    <div className='cont'>
                                        {trip.map(obj => (
                                            <div className='dis'>
                                                <i>
                                                    <span style={{ float: 'left' }}>From</span>
                                                    <span style={{ float: 'right' }}>To</span>
                                                </i><br />
                                                <h3 style={{ textAlign: 'center' }}>
                                                    <span style={{ float: 'left' }}>{obj.route.start_point}</span>
                                                    <span><EastIcon /></span>
                                                    <span style={{ float: 'right' }}>{obj.route.end_point}</span>
                                                </h3>
                                                <h5 style={{ textAlign: 'center' }}>
                                                    <span style={{ float: 'left' }}>{obj.start_time}</span>
                                                    <span style={{ float: 'right' }}>{obj.end_time}</span>
                                                </h5><br />
                                                <i>
                                                    <span style={{ float: 'left' }}>Starts</span>
                                                    <span style={{ float: 'right' }}>Ends</span>
                                                </i><br />
                                                Day:
                                                <p>{obj.day}</p><br />
                                                Bus Code:
                                                <p>{obj.bus.bus_code}</p><br />
                                                Capacity:
                                                <p>{obj.bus.capacity}</p><br />
                                                <div className='row'>
                                                    <div className='col-lg-6' style={{ padding: '3px' }}>
                                                        <Button variant='outlined'
                                                            sx={{ width: '100%' }} onClick={() => setUpdate(obj)}>Edit
                                                        </Button>
                                                    </div>
                                                    <div className='col-lg-6' style={{ padding: '3px' }}>
                                                        <Button sx={{ width: '100%' }} variant='outlined'
                                                            onClick={() => setDelete(obj)}>Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    : "Waiting for Data"}
                            </React.Fragment>
                            :
                            "Please Login"}
                    </div>
                </div>
            </div>
            <Dialog
                open={dialog}
                onClose={close}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {edit === false ? "Add Trip" : "Edit Trip"}
                </DialogTitle>
                <DialogContent>
                    <div className='colm'>
                        <lable className='lble'>Start Time</lable>
                        <input
                            className='inpt'
                            type="time"
                            onChange={(e) => setStart(e.target.value)}
                            value={edit === true ? start : null}
                            placeholder='Start From' />

                        <lable className='lble'>End Time</lable>
                        <input
                            className='inpt'
                            type="time"
                            onChange={(e) => setEnd(e.target.value)}
                            value={edit === true ? end : null}
                            placeholder='End Place' />

                        <lable className='lble'>Day</lable>
                        <input
                            className='inpt'
                            type="date"
                            onChange={(e) => setDay(e.target.value)}
                            value={edit === true ? day : null}
                            placeholder='Distance' />

                        <lable className='lble'>Select Bus</lable>
                        <select
                            className='inpt'
                            onChange={(e) => setBus(e.target.value)}
                            value={edit === true ? bus : null} >
                            <option selected={true} disabled={true}>Choose Bus</option>
                            {buses.map(obj => (
                                <option value={obj.pk}>{obj.bus_code}</option>
                            ))}
                        </select>

                        <lable className='lble'>From and To</lable>
                        <select
                            className='inpt'
                            onChange={(e) => setRoute(e.target.value)}
                            placeholder='Traveling Root'>
                            {edit === true
                                ? <option selected={true} value={route}>{getRoute}</option>
                                : <option selected={true} disabled={true}>Choose</option>
                            }
                            <optgroup label='All Routes'>
                                {routes.map(obj => (
                                    <option value={obj.pk}>{
                                        obj.start_point + " to " + obj.end_point
                                    }
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} sx={{ color: 'red' }}>Cancel</Button>
                    <Button onClick={edit === false ? insertTrip : updateTrip} autoFocus color="secondary">
                        {edit === false ? "Add Trip" : "Update Trip"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default Trips;