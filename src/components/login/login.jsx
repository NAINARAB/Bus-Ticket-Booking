import React, { useState } from "react";
import './logcss.css';
import { supabase } from "../../supabase";
import Alr from "../alert/alert";
import { useNavigate, useParams } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const nav = useNavigate();
    const { id } = useParams();

    const [alert, setAlert] = useState({});

    function admin(data) {
        sessionStorage.setItem('isadmin', true);
        sessionStorage.setItem('pkadmin', data);
        nav('/admindashboard');
    }

    function user(data) {
        sessionStorage.setItem('isuser', true);
        sessionStorage.setItem('pkuser', data);
        if(typeof id === 'boolean'){
            nav('/userdashboard')
        }else{
            nav(`/trip/${id}`)
        }
    }

    async function login() {
        try {
            if (email !== '' && password !== '') {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password)

                if (error) console.log(error)

                if (data.length !== 0) {
                    data.map(obj => {
                        obj.type == true
                            ?
                            admin(obj.pk )
                            :
                            user( obj.pk )
                    })
                } else {
                    setAlert({
                        'alrstatus': false,
                        'dispalr': true,
                        'close': setAlert,
                        'alrmes': "Invalid UserName or Password"
                    })
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function register() {
        try {
            if (email !== '' && password !== '' && password == conPassword) {
                const { data, error } = await supabase
                    .from('users')
                    .insert([{
                        email: email,
                        password: password,
                        type: false
                    }])
                    .select()
                if (error) setAlert({
                    'alrstatus': false,
                    'dispalr': true,
                    'close': setAlert,
                    'alrmes': error.message
                })
                if (data !== null) {
                    setAlert({
                        'alrstatus': true,
                        'dispalr': true,
                        'close': setAlert,
                        'alrmes': "New Account Created"
                    }); clear(); isLogin(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    function clear() {
        setEmail(''); setPassword(''); setConPassword('');
    }


    return (
        <React.Fragment>
            {alert.dispalr === true && <Alr value={alert} />}
            <div className="main">
                <div className="cntr">
                    <div className="formcard">
                        <h3>{isLogin === true ? "Login" : "SignUp"}</h3>
                        <label className="loglable">
                            Email
                        </label>
                        <input
                            type="email"
                            className="loginpt"
                            placeholder="Type Email"
                            autoFocus={true}
                            onChange={e => setEmail(e.target.value)}
                            value={email} />

                        <label className="loglable" style={{ marginTop: '1.3em' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            className="loginpt"
                            placeholder="Type Password"
                            onChange={e => setPassword(e.target.value)}
                            value={password} />

                        {isLogin === false &&
                            <>
                                <label className="loglable" style={{ marginTop: '1.3em' }}>
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="loginpt"
                                    placeholder="Re-Enter Password"
                                    onChange={e => setConPassword(e.target.value)}
                                    value={conPassword} />
                            </>
                        }<br />

                        <div style={isLogin === true
                            ? { display: 'flex', flexDirection: 'row' }
                            : { display: 'flex', flexDirection: 'row-reverse' }}>
                            <button
                                className="sbmt"
                                onClick={isLogin === true
                                    ? login
                                    : () => { setIsLogin(true); clear(); }}>
                                Login
                            </button>
                            <hr />

                            <button
                                className="sbmt"
                                onClick={isLogin === true
                                    ? () => { setIsLogin(false); clear(); }
                                    : register}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login;