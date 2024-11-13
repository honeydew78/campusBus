import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAngleDoubleDown } from 'react-icons/fa';
import './Tab.css';

export default function SeatSelection() {
  const [name, setName] = useState([]);
  const [arrowDown, setArrowDown] = useState(false);
  const [gender, setGender] = useState([]);
  const [reservedSeat, setReservedSeat] = useState([]);
  const [seatNumber, setSeatnumber] = useState([]);

  // Retrieve JWT token from localStorage (assuming it's saved after login)
  const token = localStorage.getItem('token');

  // Fetching all seats data from the API
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/seats', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT to the request
          },
        });
        const seats = response.data;
        const reserved = seats.filter(seat => seat.booked).map(seat => seat.seatNumber);
        setReservedSeat(reserved);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };
    
    if (token) {
      fetchSeats();
    }
  }, [token]);
  
  // Handle seat selection
  const getSeatNumber = async (e) => {
    let newSeat = e.target.value;

    if (reservedSeat.includes(newSeat)) {
      e.disabled = true;
      if (seatNumber.includes(newSeat)) {
        setSeatnumber(seatNumber.filter(seat => seat !== newSeat));
      }
    } else {
      setSeatnumber([...seatNumber, newSeat]);
      setReservedSeat([...reservedSeat, newSeat]);

      // Call API to reserve the seat
      try {
        await axios.post(
          `http://localhost:8080/api/seats/book/${newSeat}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass JWT with seat reservation request
            },
          }
        );
      } catch (error) {
        console.error('Error booking seat:', error);
      }
    }
  };

  // Handle gender selection for each seat
  const handleGender = (e, seatNo) => {
    const { value } = e.target;
    setGender([...gender, value]);
  };

  // Handle name entry for passengers
  const handlePassengerName = (e, seatNo) => {
    e.preventDefault();
    let value = e.target.value;
    if (!value) {
      return setName('Name is required');
    } else {
      setName([...name, value]);
    }
  };

  // Handle form submission
  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setArrowDown(true);

    // Post data to the server (you can modify the payload as needed)
    try {
      await axios.post(
        'http://localhost:8080/api/submitBooking',
        {
          seatNumbers: seatNumber,
          passengerNames: name,
          genders: gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT to the booking submission request
          },
        }
      );
      console.log('Booking details submitted successfully');
    } catch (error) {
      console.error('Error submitting booking details:', error);
    }
  };

  // Render passenger data for selected seats
  const renderPassengerData = (seatArray) => {
    return seatArray.map((seat, idx) => (
      <form key={idx} className="form seatfrm">
        <p className="text-capitalize text-center">Seat No: {seat}</p>
        <input
          className="form-control seatInp"
          onBlur={(e) => handlePassengerName(e, seat)}
          type="text"
          name="passenger-name"
          placeholder="Enter Name"
        />
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="gender"
            id="male"
            value="Male"
            onClick={(e) => handleGender(e, seat)}
          />
          <label className="form-check-label" htmlFor="male">
            Male
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="gender"
            id="female"
            value="Female"
            onClick={(e) => handleGender(e, seat)}
          />
          <label className="form-check-label" htmlFor="female">
            Female
          </label>
        </div>
      </form>
    ));
  };

  return (
    <div className="ss">
      <div className="row">
        <div className="column1">
          <div className="plane">
            <form onChange={getSeatNumber}>
              <ol className="cabin fuselage">
                {['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C', '6A', '6B', '6C', '7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B', '9C', '10A', '10B', '10C'].map((seat, idx) => (
                  <li key={idx} className="row">
                    <ol className="seats">
                      <li className="seat">
                        <input
                          type="checkbox"
                          disabled={reservedSeat.includes(seat)}
                          value={seat}
                          id={seat}
                        />
                        <label htmlFor={seat}>{seat}</label>
                      </li>
                    </ol>
                  </li>
                ))}
              </ol>
            </form>
          </div>
        </div>

        <div className="column2">
          <div className="seatInfo">
            <form className="form-group">{renderPassengerData(seatNumber)}</form>
            <div>
              <button onClick={handleSubmitDetails} className="btn btn-info seatBT">
                Confirm Details
              </button>
            </div>
            <div className={arrowDown ? 'activeArrow2' : 'nonActive'}>
              <FaAngleDoubleDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
