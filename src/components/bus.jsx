import React from 'react';
import './Bus.css';
import ChairIcon from '@mui/icons-material/Chair';

const Bus = ({ totalSeats, bookedSeats }) => {
    const renderSeats = () => {
        const seats = [];

        for (let seatNo = 1; seatNo <= totalSeats; seatNo++) {
            const isBooked = bookedSeats.includes(seatNo);
            const seatColor = isBooked ? 'rgba(255, 0, 0, 0.884)' : 'rgb(144, 238, 144)';

            seats.push(
                <>
                    <div key={seatNo} className='seat'>
                        <ChairIcon sx={{ color: seatColor }} />
                        {seatNo}
                    </div>
                </>
            );
        }

        return seats;
    };

    return <div className="bus">{renderSeats()}</div>;
};

export default Bus;
