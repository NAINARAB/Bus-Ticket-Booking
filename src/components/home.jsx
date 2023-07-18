import React, { useState, useEffect } from "react";
import EastIcon from '@mui/icons-material/East';
import Header from "./header/hed";
import { supabase } from "../supabase";
import './com.css';
import { useNavigate } from "react-router-dom";
import pushActivity from "./activity/activitypush";

const Home = () => {
    const [trip, setTrip] = useState([]);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const isUser = sessionStorage.getItem('isuser');
    const nav = useNavigate()
    const today = new Date;
    useEffect(() => {
        fetchBus();
    }, [])

    async function fetchBus() {
        try {
            const { data, error } = await supabase
                .from('trip')
                .select(`*,
                        bus: bus_pk (*),
                        route: route_pk (*)`)
                .eq('status', false)
                .gte('day', today.toISOString())
            if (error) throw console.log(error)
            if (data !== null) {
                setTrip(data)
            }pushActivity('Visited to Home')
        } catch (e) { console.log(e) }
    }

    function navto(arg){
        const value = parseInt(arg);
        if(isUser){
            nav(`/trip/${value}`)
        }else{
            nav(`trip/${value}`)
        }
    }

    return (
        <React.Fragment>
            <Header />
            <div className="home">
                <center>
                    <h2>Welcome To Our Site</h2>
                    <h4>Let's Start Your Journey</h4>
                </center>
                <div className="sbus">
                    <div className="place">
                        &nbsp;&nbsp;&nbsp;&nbsp;From
                        <input className='placeinput'
                            onChange={(e) => { setStart(e.target.value.toLowerCase()); console.log(e.target.value) }} />
                    </div>
                    <div className="place">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To
                        <input className='placeinput'
                            onChange={(e) => setEnd(e.target.value.toLowerCase())} />
                    </div>
                </div>
            </div>
            <div className="spaces" style={{ padding: '2em' }}>
                <h3>&emsp;Availbale Trips</h3><br />
                <div className="cont">
                    {start === '' || end === '' ?
                        <>
                            {trip.map(obj => (
                                <div className='dis hov' onClick={() => {navto(obj.pk)}}>
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
                                    </h5><br /><br />
                                    
                                    Day:
                                    <p>{obj.day}</p><br />
                                    Seats:
                                    <p>{obj.bus.capacity}</p><br />
                                </div>
                            ))}
                        </>
                        :
                        <>
                            {trip.map(obj => {
                                const isMatched = obj.route.start_point.toLowerCase().includes(start) &&
                                    obj.route.end_point.toLowerCase().includes(end);
                                console.log(isMatched, obj)
                                return isMatched ? (
                                    <div className='dis hov' onClick={() => {navto(obj.pk)}}>
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
                                    </div>
                                ) : null;
                            })}
                        </>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;