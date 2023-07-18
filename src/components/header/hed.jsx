import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import './hed.css';
import { useNavigate } from "react-router-dom";


const Header = () => {
    const isAdmin = Boolean(sessionStorage.getItem('isadmin'));
    const isUser = Boolean(sessionStorage.getItem('isuser'));
    const nav = useNavigate();
    function logout(){
        if(isAdmin || isUser){
            nav('/');
            sessionStorage.clear();
        }else{
            nav(`/login/${false}`)
        }
    }

    return (
        <React.Fragment>
            <div className="hed">
                <h3 style={{ display: 'inline', paddingLeft:'1.6em' }}>Book My Trip</h3>
                <div className="right">
                    <IconButton
                        onClick={() => {logout() }}>
                        {isAdmin === true || isUser === true 
                        ? <LogoutIcon sx={{ color: 'white' }}/> 
                        : <LoginIcon sx={{ color: 'white' }} />}
                    </IconButton>
                </div>
            </div>
            <div style={{marginBottom:'4.50em'}}></div>
            <div className="devlop">
                Devloped By - RajNainaar (rajnainaar@gmail.com)
            </div>
        </React.Fragment>
    );
}

export default Header;