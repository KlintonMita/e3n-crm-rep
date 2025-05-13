import React from "react";
import "./body.css";
import defaultUser from "../../assets/img/default-user.png";

function Body() {
  return (
    <div className="main-frame">
      <div className="main-body">
        <div className="dash-details">
          <div className="time">
            <div className="day">
              <h3>April</h3>
              <h2>28</h2>
            </div>
            <div className="real-time">
              <h3>Monday</h3>
              <h2>00:45</h2>
            </div>
          </div>
          <div className="weather">
            <div className="weather-img">
              <h3>Sunny</h3>
            </div>
            <div className="live-weather">
              <h3>Osnabrueck</h3>
              <h2>9 degree</h2>
            </div>
          </div>
          <div className="plan">
            <div className="daily-plan">
              <h2>119</h2>
            </div>
            <div className="hours-workers">
              <h3>27:00 h</h3>
              <h2>Sales: EUR 3200</h2>
            </div>
          </div>
        </div>
        <div className="termin">
          <div className="dates">
            <h2>Dates</h2>
          </div>
          <div className="termin-details">11:00 - 12:00 RM Call</div>
        </div>
        <div className="present">
          <div className="present-title">
            <h2>Present</h2>
          </div>
          <div className="present-person">
            <div className="person-img"><img src={defaultUser} alt="" /></div>
            <div className="person-details">
              <h2>Klinton Mita</h2>
              <h3>Manager</h3>
              <h3>10:00</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
