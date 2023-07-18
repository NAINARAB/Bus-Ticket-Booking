import React, { useState, useEffect } from 'react';
import Header from '../header/hed';
import Sidenav from '../sidenav/sidenav';
import { supabase } from '../../supabase';
import { Alert, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import DialogBox from '../DialogBox/dialog';
import Alr from '../alert/alert';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import pushActivity from '../activity/activitypush';

const AdminNotification = () => {
    const [allNotification, setAllNotification] = useState([]);
    const [dialogobj, setDialogObj] = useState({});
    const [pk, setPK] = useState();
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [alert, setAlert] = useState({});
    const [fet, setFet] = useState(false);
    const isAdmin = Boolean(sessionStorage.getItem('isadmin'))

    useEffect(() => {
        if (isAdmin) {
            fetchNotification();
        }
    }, [fet])
    const doRefresh = () => setFet(!fet);

    async function fetchNotification() {
        try {
            const { data, error } = await supabase
                .from('notification')
                .select('*')
                .eq('to_all_status', true)
            if (error) { }
            if (data) {
                setAllNotification(data);
            }
        } catch (e) { }
    }
    async function pushNotification() {
        try {
            const { data, error } = await supabase
                .from('notification')
                .insert([{
                    'message': message,
                    'to_all_status': true
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
            if (data) {
                setAlert({
                    'dispalr': true,
                    'alrstatus': true,
                    'close': setAlert,
                    'alrmes': "Notification Send To All Customers"
                });setOpen(false); setMessage('');
            }
            pushActivity('Notification Added')
        } catch (e) { }
    }
    async function updateNotification() {
        try {
            const { data, error } = await supabase
                .from('notification')
                .update([{
                    'message': message,
                    'to_all_status': true
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
            }
            if (data) {
                setAlert({
                    'dispalr': true,
                    'alrstatus': true,
                    'close': setAlert,
                    'alrmes': "Notification Updated"
                }); setOpen(false); setMessage('');
                pushActivity('Notification Modified')
            }
        } catch (e) { }
    }


    function closeDelete() {
        setDialogObj({ 'open': false })
    }
    function setDelete(arg) {
        setDialogObj({
            'open': true,
            'pk': arg.pk,
            'table': 'notification',
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
                    <Sidenav user={"admin"} current={'notifications'} />
                </div>
                <div className='col-lg-10'>
                    {isAdmin === true ?
                        <div className='spaces'>
                            <Button
                                color="secondary"
                                variant='outlined'
                                onClick={() => setOpen(true)}>
                                New Notification
                            </Button><br /><br />
                            <div className='cont'>
                                {allNotification.length !== 0
                                    ? allNotification.map(obj =>
                                    (<Alert
                                        key={obj.pk}
                                        sx={{ width: '100%', maxWidth: '380px' }}
                                        severity='info'
                                        onClose={() => setDelete(obj)}>
                                        <IconButton
                                            onClick={() => {
                                                setPK(obj.pk);
                                                setOpen(true);
                                                setEdit(true)
                                                setMessage(obj.message)
                                            }}>
                                            <EditIcon />
                                        </IconButton>
                                        {obj.message}
                                    </Alert>))
                                    : <h3>No Notifications</h3>
                                }
                            </div>
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
                    {edit === false ? "New Notification" : "Edit Notification"}
                </DialogTitle>
                <DialogContent>
                    <div className='colm'>
                        <lable className='lble'>Your Message</lable>
                        <textarea
                            className='inpt'
                            style={{ minWidth: '300px' }}
                            onChange={(e) => setMessage(e.target.value)}
                            value={edit === true ? message : null}
                            placeholder='Type Your Message' />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'red' }}>Cancel</Button>
                    <Button onClick={edit === false ? pushNotification : updateNotification} autoFocus color="secondary">
                        {edit === false ? "Publish Notification" : "Update Notification"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default AdminNotification;