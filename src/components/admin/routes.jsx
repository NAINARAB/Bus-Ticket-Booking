import './admin.css';
import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Chip, IconButton } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../supabase';
import Alr from '../alert/alert';
import DialogBox from '../DialogBox/dialog';
import pushActivity from '../activity/activitypush';

const BusRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [pk, setPK] = useState();
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [tempWay, setTempWay] = useState('');
    const [way, setWay] = useState([]);
    const [price, setPrice] = useState();
    const [km, setKM] = useState();

    const [searchdata, setSearchdata] = useState('');
    const [edit, setEdit] = useState(false);
    const [alert, setAlert] = useState({});
    const [dialogobj, setDialogObj] = useState({});
    const [refresh, setRefresh] = useState(false);
    const isAdmin = Boolean(sessionStorage.getItem('isadmin'));
    const [dialog, setDialog] = useState(false);
    const close = () => { setDialog(false); setEdit(false); setWay([]); setTempWay('') };
    const doRefresh = () => setRefresh(!refresh);

    useEffect(() => {
        fetchRoutes();
    }, [refresh])

    async function fetchRoutes() {
        if (isAdmin) {
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

    async function insertRoutes() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('routes')
                    .insert([{
                        'start_point': start,
                        'end_point': end,
                        'travel_way': way,
                        'ticket_price': price,
                        'total_km': km,
                    }])
                if (error) {
                    setAlert({
                        'dispalr': true, 'alrstatus': false, 'close': setAlert,
                        'alrmes': error.message || error.details
                    })
                } else {
                    setAlert({
                        'dispalr': true, 'alrstatus': true, 'close': setAlert,
                        'alrmes': "New Route Added"
                    }); setDialog(false); setRefresh(!refresh);
                }
                pushActivity('Route Added');
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function updateRoutes() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('routes')
                    .update([{
                        'start_point': start,
                        'end_point': end,
                        'travel_way': way,
                        'ticket_price': price,
                        'total_km': km,
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
                        'alrmes': "Route Updated"
                    }); doRefresh(); close(); pushActivity('Route Updated');
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
        setStart(arg.start_point); setEnd(arg.end_point); setWay(arg.travel_way);
        setPrice(arg.ticket_price); setKM(arg.total_km);
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
            <Header />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"admin"} current={'routes'} />
                </div>
                <div className='col-lg-10'>
                    <div className="search">
                        <input type={'search'} className='micardinpt'
                            placeholder="Search Route Details"
                            onChange={(e) => {
                                setSearchdata((e.target.value).toLowerCase());
                            }}
                            style={{ paddingLeft: '3em' }} />
                        <div className="sIcon">
                            <SearchIcon sx={{ fontSize: '2em' }} />
                        </div>
                    </div><br />

                    <div className='spaces'>
                        {isAdmin === true ?
                            <React.Fragment>
                                <Button
                                    color="secondary"
                                    variant='outlined'
                                    onClick={() => setDialog(true)}>
                                    Add Routes
                                </Button><br /><br />

                                {routes.length !== 0 ?
                                    searchdata === '' ?
                                        <div className='cont'>
                                            {routes.map(obj =>
                                                <div className='dis'>
                                                    <i>
                                                        <span style={{ float: 'left' }}>From</span>
                                                        <span style={{ float: 'right' }}>To</span>
                                                    </i><br />
                                                    <h3 style={{ textAlign: 'center' }}>
                                                        <span style={{ float: 'left' }}>{obj.start_point}</span>
                                                        <span><EastIcon /></span>
                                                        <span style={{ float: 'right' }}>{obj.end_point}</span>
                                                    </h3>
                                                    Total Distance
                                                    <p>{obj.total_km}</p><br />
                                                    Ticket Price
                                                    <p>{obj.ticket_price}</p><br />
                                                    Travel Root
                                                    <p>{obj.travel_way.toString()}</p><br />
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
                                                </div>)}
                                        </div>
                                        :
                                        <div className='cont'>
                                            {routes.map(obj =>
                                                (obj.start_point.toLowerCase()).match(searchdata) ||
                                                    (obj.end_point.toLowerCase()).match(searchdata) ||
                                                    ((obj.travel_way.toString()).toLowerCase()).match(searchdata) ?
                                                    <div className='dis'>
                                                        <i>
                                                            <span style={{ float: 'left' }}>From</span>
                                                            <span style={{ float: 'right' }}>To</span>
                                                        </i><br />
                                                        <h3 style={{ textAlign: 'center' }}>
                                                            <span style={{ float: 'left' }}>{obj.start_point}</span>
                                                            <span><EastIcon /></span>
                                                            <span style={{ float: 'right' }}>{obj.end_point}</span>
                                                        </h3>
                                                        Total Distance
                                                        <p>{obj.total_km}</p><br />
                                                        Ticket Price
                                                        <p>{obj.ticket_price}</p><br />
                                                        Travel Root
                                                        <p>{obj.travel_way.toString()}</p><br />
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
                                                    </div> : null)}
                                        </div>
                                    :
                                    "Waiting For Data Or No Routes Found"}
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
                    {edit === false ? "Add Routes" : "Edit Routes"}
                </DialogTitle>
                <DialogContent>
                    <div className='colm'>
                        <lable className='lble'>Origin</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setStart(e.target.value)}
                            value={edit === true ? start : null}
                            placeholder='Start From' />

                        <lable className='lble'>Destination</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setEnd(e.target.value)}
                            value={edit === true ? end : null}
                            placeholder='End Place' />

                        <lable className='lble'>Total Distance</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setKM(e.target.value)}
                            value={edit === true ? km : null}
                            placeholder='Distance' />

                        <lable className='lble'>Ticket Price</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setPrice(e.target.value)}
                            value={edit === true ? price : null}
                            placeholder='Distance' />

                        <lable className='lble'>Travel Way</lable>
                        <div>
                            {way.map((item, index) => {
                                return (
                                    <>
                                        <Chip label={item} sx={{ margin: '2px' }}
                                            onDelete={() => {
                                                setWay(way.filter(obj => obj !== item));
                                            }
                                            } />
                                    </>
                                );
                            })}
                        </div>
                        <input
                            className='inpt'
                            onChange={(e) => setTempWay(e.target.value)}
                            placeholder='Traveling Root'
                            value={tempWay} />
                        <div className='arrayadd'>
                            <IconButton sx={{ backgroundColor: '#f2f2f2' }} onClick={() => {
                                setWay([...way, tempWay]);
                                setTempWay('');
                            }}><AddIcon /></IconButton>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} sx={{ color: 'red' }}>Cancel</Button>
                    <Button onClick={edit === false ? insertRoutes : updateRoutes} autoFocus color="secondary">
                        {edit === false ? "Add Routes" : "Update Routes"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default BusRoutes;