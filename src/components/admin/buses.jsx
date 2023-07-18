import './admin.css';
import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { supabase } from '../../supabase';
import Alr from '../alert/alert';
import DialogBox from '../DialogBox/dialog';
import { Link } from 'react-router-dom';

const Buses = () => {
    const [buses, setBuses] = useState([]);
    const [busCode, setBusCode] = useState('');
    const [busNo, setBusNo] = useState('');
    const [capacity, setCapacity] = useState();
    const [pk, setPK] = useState();

    
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
        fetchBus();
    }, [refresh])

    async function fetchBus() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('buses')
                    .select('*')
                if (error) throw console.log(error)
                if (data !== null) {
                    setBuses(data)
                }
            } catch (e) { console.log(e) }
        }
    }

    async function insertBus() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('buses')
                    .insert([{
                        'capacity': capacity,
                        'bus_no': busNo,
                        'bus_code': busCode
                    }])
                    .select()
                if (error) {
                    setAlert({
                        'dispalr': true,
                        'alrstatus': false,
                        'close': setAlert,
                        'alrmes': error.message || error.details
                    })
                }
                if (data !== null) {
                    setAlert({
                        'dispalr': true,
                        'alrstatus': true,
                        'close': setAlert,
                        'alrmes': "New Bus Added"
                    }); setDialog(false); setRefresh(!refresh);
                }
                try {
                    const {data} = await supabase
                    .from('activity')
                    .insert([{
                        'event': 'Bus Added' 
                    }])
                    if(data){}
                }catch(e){}
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function updateBus() {
        if (isAdmin) {
            try {
                const { data, error } = await supabase
                    .from('buses')
                    .update([{
                        'capacity': capacity,
                        'bus_no': busNo,
                        'bus_code': busCode
                    }])
                    .eq('pk', pk)
                    .select()
                if (error) {
                    setAlert({
                        'dispalr': true,
                        'alrstatus': false,
                        'close': setAlert,
                        'alrmes': error.message || error.details
                    })
                } else {
                    setAlert({
                        'dispalr': true,
                        'alrstatus': true,
                        'close': setAlert,
                        'alrmes': "Bus Updated"
                    });doRefresh(); close();
                }
                try {
                    const {data} = await supabase
                    .from('activity')
                    .insert([{
                        'event': 'Bus Updated' 
                    }])
                    if(data){}
                }catch(e){}
            } catch (e) {
                console.log(e);
            }
        }
    }

    function setUpdate(arg) {
        setEdit(true);
        setDialog(true);
        setPK(arg.pk);
        setBusCode(arg.bus_code);
        setBusNo(arg.bus_no);
        setCapacity(arg.capacity);
    }
    function closeDelete(){
        setDialogObj({'open':false})
    }
    function setDelete(arg) {
        setDialogObj({
            'open': true,
            'pk': arg.pk,
            'table': 'buses',
            'refresh': doRefresh,
            'close':closeDelete
        });
    }

    return (
        <React.Fragment>
            {alert.dispalr === true && <Alr value={alert} />}
            {dialogobj.open === true && <DialogBox value={dialogobj} />}
            <Header />
            <div className='row'>
                <div className='col-lg-2'>
                    <Sidenav user={"admin"} current={'buses'} />
                </div>
                <div className='col-lg-10'>

                    <div className="search">
                        <input type={'search'} className='micardinpt'
                            placeholder="Search Bus Details"
                            onChange={(e) => {
                                setSearchdata((e.target.value).toLowerCase());
                            }}
                            style={{ paddingLeft: '3em' }} />
                        <div className="sIcon">
                            <SearchIcon sx={{ fontSize: '2em' }} />
                        </div>
                    </div><br />

                    <div className='spaces'>
                        {isAdmin === true
                            ?
                            <React.Fragment>
                                <Button
                                    color="secondary"
                                    variant='outlined'
                                    onClick={() => setDialog(true)}>
                                    Add Buses
                                </Button><br /><br />

                                {buses.length !== 0 ?
                                    searchdata === '' ?
                                        <div className='cont'>
                                            {buses.map(obj => (
                                                <div className='dis'>Bus Number
                                                    <h3 className='tit'>{obj.bus_no}</h3>
                                                    Bus Code :
                                                    <p>{obj.bus_code}</p><br />
                                                    Total Seats:
                                                    <p>{obj.capacity}</p><br />
                                                    <div className='row'>
                                                        <div className='col-lg-6' style={{ padding: '3px' }}>
                                                            <Button variant='outlined'
                                                                sx={{ width: '100%' }} onClick={() => setUpdate(obj)}>Edit</Button>
                                                        </div>
                                                        <div className='col-lg-6' style={{ padding: '3px' }}>
                                                            <Button sx={{ width: '100%' }} variant='outlined'
                                                                onClick={() => setDelete(obj)}>Delete</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        :

                                        <div className='cont'>
                                            {buses.map(obj => (
                                                (obj.bus_no.toLowerCase()).match(searchdata) ||
                                                    (obj.bus_code.toLowerCase()).match(searchdata) ||
                                                    (obj.capacity.toString()).match(searchdata) ?
                                                    <div className='dis'>Bus Number
                                                        <h3 className='tit'>{obj.bus_no}</h3>
                                                        Bus Code :
                                                        <p>{obj.bus_code}</p><br />
                                                        Total Seats:
                                                        <p>{obj.capacity}</p><br />
                                                        <div className='row'>
                                                            <div className='col-lg-6' style={{ padding: '3px' }}>
                                                                <Button variant='outlined'
                                                                    sx={{ width: '100%' }} onClick={() => setUpdate(obj)}>Edit</Button>
                                                            </div>
                                                            <div className='col-lg-6' style={{ padding: '3px' }}>
                                                                <Button sx={{ width: '100%' }} variant='outlined'
                                                                    onClick={() => setDelete(obj)}>Delete</Button>
                                                            </div>
                                                        </div>
                                                    </div> : null
                                            ))}
                                        </div>
                                    : <h3>Currently No Buses</h3>}
                            </React.Fragment>
                            : <h2>Please Login <Link to={`/login/${false}`}>Go To Login Page</Link> </h2>}
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
                    {edit === false ? "Add Buses" : "Edit Bus"}
                </DialogTitle>
                <DialogContent>
                    <div className='colm'>
                        <lable className='lble'>Bus No</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setBusNo(e.target.value)}
                            value={edit === true ? busNo : null}
                            placeholder='Enter Bus Number' />
                        <lable className='lble'>Bus Code</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setBusCode(e.target.value)}
                            value={edit === true ? busCode : null}
                            placeholder='Enter Bus Code' />
                        <lable className='lble'>Seat Capacity</lable>
                        <input
                            className='inpt'
                            onChange={(e) => setCapacity(e.target.value)}
                            value={edit === true ? capacity : null}
                            placeholder='Enter Seat Capacity' />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} sx={{ color: 'red' }}>Cancel</Button>
                    <Button onClick={edit === false ? insertBus : updateBus} autoFocus color="secondary">
                        {edit === false ? "Add Bus" : "Update Bus"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default Buses;