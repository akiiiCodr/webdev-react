import React from 'react';

function Reservation() {
  return (
    <div className="room-booking-form">
      <h1>Book a Room</h1>

      <form>
        {/* Name Fields */}
        <div className="form-group">
          <label htmlFor="first-name">Name <span>*</span></label>
          <div className="name-fields">
            <input type="text" id="first-name" placeholder="First Name" required />
            <input type="text" id="last-name" placeholder="Last Name" required />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">E-mail <span>*</span></label>
          <input type="email" id="email" placeholder="example@example.com" required />
        </div>

        {/* Room Type Dropdown */}
        <div className="form-group">
          <label htmlFor="room-type">Room Type <span>*</span></label>
          <select id="room-type" required>
            <option value="">Please Select</option>
            <option value="big-room">Big Room</option>
            <option value="very-big-room">Very Big Room</option>
            <option value="king-room">King Room</option>
          </select>
        </div>

        {/* Number of Guests */}
        <div className="form-group">
          <label htmlFor="number-of-guests">Number of Guests <span>*</span></label>
          <input type="number" id="number-of-guests" min="1" required />
        </div>

        {/* Arrival Date & Time */}
        <div className="form-group">
          <label htmlFor="arrival-date">Arrival Date & Time <span>*</span></label>
          <input type="date" id="arrival-date" required />
          <input type="time" id="arrival-time" required />
        </div>

        {/* Departure Date */}
        <div className="form-group">
          <label htmlFor="departure-date">Departure Date <span>*</span></label>
          <input type="date" id="departure-date" required />
        </div>




        {/* Book a Room Options */}
        <div className="form-group">
          <label>Book a Room</label>
          <div className="radio-group">
            <input type="radio" id="big-room" name="room-book" value="89.00" />
            <label htmlFor="big-room">Big Room $89.00</label>
            <input type="radio" id="very-big-room" name="room-book" value="120.00" />
            <label htmlFor="very-big-room">Very Big Room $120.00</label>
            <input type="radio" id="king-room" name="room-book" value="199.00" />
            <label htmlFor="king-room">King Room $199.00</label>
          </div>
        </div>

        {/* Total Amount */}
        <div className="form-group">
          <label>Total</label>
          <div className="total-amount">$0.00</div>
        </div>

        {/* PayPal Button */}
        {/* <div className="form-group">
          <button type="button" className="paypal-button">PayPal Buy Now</button>
        </div> */}

        {/* Submit Button */}
        <button type="submit" className="reserve">Submit</button>
      </form>
    </div>
  );
}

export default Reservation
