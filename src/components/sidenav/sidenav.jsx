import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import GridViewIcon from '@mui/icons-material/GridView';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import DirectionsIcon from '@mui/icons-material/Directions';
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import './side.css';

const Sidenav = ({ user, current }) => {
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <div className="menu">
                <IconButton onClick={() => setOpen(!open)}>
                    {open === false 
                    ? <MenuIcon sx={{ color: 'white' }} />
                    : <CloseIcon sx={{ color: 'white' }}/>}
                </IconButton>
            </div>

            <div className="side" style={open === true ? {display:'flex'} : null}>
                {user === "admin"
                    ?
                    <React.Fragment>
                        <button onClick={
                            () => {nav('/admindashboard')}} 
                            className={current === 'dashboard' ? "sbutton crnt" : 'sbutton'}>
                                <GridViewIcon /> Dashboard
                        </button>
                        <button onClick={
                            () => {nav('/adminbus')}} 
                            className={current === 'buses' ? "sbutton crnt" : 'sbutton'}>
                                <DirectionsBusFilledIcon /> Buses
                        </button>
                        <button onClick={
                            () => {nav('/adminroutes')}} 
                            className={current === 'routes' ? "sbutton crnt" : 'sbutton'}>
                                <DirectionsIcon /> Routes
                        </button>
                        <button onClick={
                            () => {nav('/admintrips')}} 
                            className={current === 'trips' ? "sbutton crnt" : 'sbutton'}>
                                <ModeOfTravelIcon /> Trips
                        </button>
                        <button onClick={
                            () => {nav('/adminbookings')}} 
                            className={current === 'bookings' ? "sbutton crnt" : 'sbutton'}>
                                <AppRegistrationIcon /> Bookings
                        </button>
                        <button onClick={
                            () => {nav('/adminnotifications')}} 
                            className={current === 'notifications' ? "sbutton crnt" : 'sbutton'}>
                                <NotificationsNoneIcon /> Notification
                        </button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <button 
                            onClick={() => {nav('/userdashboard')}} 
                            className={current === 'dashboard' ? "sbutton crnt" : 'sbutton'}>
                                <GridViewIcon /> Dashboard
                        </button>
                        <button 
                            onClick={() => {nav('/usermytickets')}} 
                            className={current === 'mytickets' ? "sbutton crnt" : 'sbutton'}>
                                <LocalActivityIcon /> My Tickets
                        </button>
                        <button 
                            onClick={() => {nav('/usernotification')}} 
                            className={current === 'notification' ? "sbutton crnt" : 'sbutton'}>
                                <NotificationsNoneIcon /> Notification
                        </button>
                        <button 
                            onClick={() => {nav('/userbussearch')}} 
                            className={current === 'searchbus' ? "sbutton crnt" : 'sbutton'}>
                                <SearchIcon /> Search Bus
                        </button>
                    </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}

export default Sidenav;