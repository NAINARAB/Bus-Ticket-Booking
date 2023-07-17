import React, { useState, useEffect } from "react";
import Header from "./header/hed";
import { supabase } from "../supabase";
import './com.css';
import { Link, useParams } from "react-router-dom";
import Bus from "./bus";
import Alr from "./alert/alert";

const TripDetails = () => {
    const [tripdetails, setTripDetails] = useState([]);

    const [bookedSeats, setBookedSeats] = useState([]);
    const [totalSeatsArray, setTotalSeatsArray] = useState([]);
    const [totalSeat, setTotalSeat] = useState();
    const [seatCost, setSeatCost] = useState();
    

    const [passengerNameArray, setPassengerNameArray] = useState([]);
    const [passengerAgeArray, setPassengerAgeArray] = useState([]);
    const [passengerSeatArray, setPassengerSeatArray] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [crntName, setCrntName] = useState('');
    const [crntAge, setCrntAge] = useState('');
    const [crntSeat, setCrntSeat] = useState(null);
    

    // const [sam, setSam] = useState([]);
    const [fet, setFet] = useState(false);
    const [alert, setAlert] = useState({});
    const { id } = useParams();
    const isuser = sessionStorage.getItem('isuser');
    const userPK = sessionStorage.getItem('pkuser');
    useEffect(() => {
        fetchTrip()
    }, [fet])

    async function fetchTrip() {
        try {
            const { data, error } = await supabase
                .from('trip')
                .select(`*,
                        bus: bus_pk (*),
                        route: route_pk (*)`)
                .eq('pk', id)
            if (error) throw console.log(error)
            if (data) {
                let total = data.map(obj => obj.bus.capacity)
                let temp = [];
                setTotalSeat(total)
                for (let i = 1; i <= total; i++) {
                    temp[i] = i;
                }
                setTotalSeatsArray(temp)
                setTripDetails(data)
                setSeatCost(data.map(obj => obj.route.ticket_price))
            }
        } catch (e) { }
        try {
            const { data, error } = await supabase
                .from('seats')
                .select('*')
                .eq('trip_id', id)
            if (error) throw console.log(error)
            if (data) {
                let seat = [];
                for (let i = 0; i < data.length; i++) {
                    seat[i] = data[i].seat_no
                }
                setBookedSeats(seat)
            }
        } catch (e) { }
    }

    async function BookSeats(args) {
        try {
            const { data, error } = await supabase
                .from('seats')
                .insert([{
                    'user_id': userPK,
                    'passenger_name': args.name,
                    'passenger_age': args.age,
                    'seat_no': args.seat,
                    'trip_id': id
                }])
                .select()
            if (error) throw console.log(error)
            if (data) {
                console.log("Successfully booked")
            }
        } catch { }
    }

    function loopInsert() {
        let lnth = passengerNameArray.length
        for (let i = 0; i < lnth; i++) {
            console.log('pass')
            BookSeats({
                'name': passengerNameArray[i],
                'age': passengerAgeArray[i],
                'seat': passengerSeatArray[i]
            })
        }
        setFet(!fet);
        setAlert({
            'dispalr': true, 'alrstatus': true, 'close': setAlert,
            'alrmes': "Tickets Reserved You Can Pay Later"
        });setPassengerNameArray([]);setPassengerAgeArray([]);setPassengerSeatArray([]);
        setTotalCost(0);
    }

    function insertPassenger() {
        if (crntName !== '' && crntAge !== '' && crntSeat !== null) {
            setPassengerNameArray([...passengerNameArray, crntName]); setCrntName('');
            setPassengerAgeArray([...passengerAgeArray, crntAge]); setCrntAge('');
            setPassengerSeatArray([...passengerSeatArray, crntSeat]); setCrntSeat(null);
            setTotalCost(parseInt(totalCost) + parseInt(seatCost));
        }
    }

    return (
        <React.Fragment>
            {alert.dispalr === true && <Alr value={alert} />}
            <Header />
            <div className="fuldiv">
                <div className="row">
                    <div className="col-lg-4">
                        <Bus totalSeats={totalSeat} bookedSeats={bookedSeats} />
                    </div>
                    <div className="col-lg-8">
                        <h2 style={{ color: 'white' }}>Book Your Seats Now</h2>
                        {tripdetails.map(obj => (
                            <h3 style={{ color: 'lightpink' }}>
                                {(obj.route.start_point + " To " + obj.route.end_point).toUpperCase()} -
                                <span style={{color:'white'}}>
                                    &nbsp;Ticket Price ({seatCost})
                                </span>
                            </h3>
                        ))}
                        {isuser ?
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {passengerNameArray.length !== 0 &&
                                    <>
                                        <div className="box">
                                            Passenger Names : {passengerNameArray.map(obj => (
                                                obj + ", "
                                            ))}
                                        </div>
                                        <div className="box">
                                            Passenger Age &nbsp;&emsp;: {passengerAgeArray.map(obj => (
                                                obj + ", "
                                            ))}
                                        </div>
                                        <div className="box">
                                            Seats Selected &nbsp;&emsp;: {passengerSeatArray.map(obj => (
                                                obj + ", "
                                            ))}
                                        </div>
                                        <h3 style={{color:'white'}}>Total Amount {totalCost}</h3>
                                    </>}
                                <br />
                                <form>
                                    <label>Passenger Name</label><br />
                                    <input
                                        className="inpt"
                                        value={crntName}
                                        onChange={(e) => setCrntName(e.target.value)}
                                        required 
                                        placeholder="Name"/><br />
                                    <label>Age</label><br />
                                    <input
                                        type="number"
                                        className="inpt"
                                        value={crntAge}
                                        onChange={(e) => setCrntAge(e.target.value)}
                                        required min={0}
                                        placeholder="Age"/><br />
                                    <label>Choose Seat</label><br />
                                    <select
                                        className="inpt"
                                        onChange={(e) => { setCrntSeat(e.target.value) }}
                                        required 
                                        placeholder="Seat No">
                                        <option value={null} disabled={true} selected={true}>Select Seat</option>
                                        {totalSeatsArray
                                            .filter(total => !bookedSeats.includes(total))
                                            .map(total => <option key={total}>{total}</option>)
                                        }
                                    </select><br />
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                        onClick={insertPassenger}>Add</button>
                                </form>
                                {passengerNameArray.length !== 0 &&
                                    <button
                                        className="btn btn-success"
                                        onClick={() => { loopInsert() }}>
                                        Submit
                                    </button>}
                            </div>
                            : <h3 style={{ color: 'white' }}>Please Login to Book Your Tickets
                                <br /><br /><Link style={{ color: 'yellow' }} to={`/login/${id}`}>Go To Login Page</Link></h3>}
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
}

export default TripDetails;