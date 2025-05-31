import { useState, useEffect } from "react";
import "./body.css";
import defaultUser from "../../assets/img/default-user.png";
import freeImg from "../../assets/absent-reason/dayOff.png";
import sickImg from "../../assets/absent-reason/sickDay.png";
import parentalImg from "../../assets/absent-reason/parental_leave.png";
import { useSchedule } from "./scheduleContext";

type Employer = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
};

type Props = {
  employers?: Employer[];
};

const weatherIcons = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "⛅",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌦️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

function Body({ employers = [] }: Props) {
  const [text, setText] = useState("Meeting Reminder");
  const [isEditing, setIsEditing] = useState(false);
  const { schedule, getTodaysWorkers } = useSchedule();
  const [currentDate] = useState(new Date());
  const [time] = useState(new Date());
  const [weather, setWeather] = useState({
    city: "Detecting location...",
    temp: "--",
    condition: "Loading...",
    icon: "☁️",
  });
  const [locationError, setLocationError] = useState(false);

  const scheduledWorkers = getTodaysWorkers(employers);
  const workers = scheduledWorkers.map((e: Employer) => ({
    id: parseInt(e.id),
    name: e.name,
    role: e.role,
  }));

  const getTodaysAbsentWorkers = (employers: Employer[]) => {
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${today.getFullYear()}`;

    return employers.filter(employer => {
      const workerId = parseInt(employer.id);
      const todaySchedule = schedule[workerId]?.[todayStr];
      return todaySchedule && ['free', 'parental', 'sick'].includes(todaySchedule.type || '');
    });
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    setText(e.currentTarget.textContent || "11:00 - 12:00 RM Call");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      setText(e.currentTarget.textContent || "11:00 - 12:00 RM Call");
    }
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    const fetchWeatherByCoords = async (lat: number, lon: number) => {
      try {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();

        const cityResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
        );
        const cityData = await cityResponse.json();

        const cityName =
          cityData.address?.city ||
          cityData.address?.town ||
          cityData.address?.county ||
          (Math.abs(lat - 52.2799) < 0.5 && Math.abs(lon - 8.0472) < 0.5
            ? "Osnabrueck"
            : cityData.address?.village || "Your Location");

        setWeather({
          city: cityName,
          temp: `${weatherData.current_weather.temperature}°C`,
          condition: getWeatherCondition(
            weatherData.current_weather.weathercode
          ),
          icon: getWeatherIcon(
            weatherData.current_weather.weathercode,
            weatherData.current_weather.is_day
          ),
        });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        setLocationError(true);
        setWeather({
          city: "Osnabrueck",
          temp: "24°C",
          condition: "Sunny",
          icon: "☀️",
        });
      }
    };

    const getWeatherCondition = (code: number) => {
      const conditions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Drizzle",
        53: "Drizzle",
        55: "Drizzle",
        56: "Freezing drizzle",
        57: "Freezing drizzle",
        61: "Rain",
        63: "Rain",
        65: "Heavy rain",
        66: "Freezing rain",
        67: "Freezing rain",
        71: "Snow",
        73: "Snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Rain showers",
        81: "Rain showers",
        82: "Heavy rain showers",
        85: "Snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Heavy thunderstorm",
      };
      return conditions[code as keyof typeof conditions] || "Unknown";
    };

    const getWeatherIcon = (code: number, isDay: number) => {
      const icons = {
        0: isDay ? "01d" : "01n",
        1: isDay ? "02d" : "02n",
        2: isDay ? "03d" : "03n",
        3: "04d",
        45: "50d",
        48: "50d",
        51: "09d",
        53: "09d",
        55: "09d",
        56: "13d",
        57: "13d",
        61: "10d",
        63: "10d",
        65: "10d",
        66: "13d",
        67: "13d",
        71: "13d",
        73: "13d",
        75: "13d",
        77: "13d",
        80: "09d",
        81: "09d",
        82: "09d",
        85: "13d",
        86: "13d",
        95: "11d",
        96: "11d",
        99: "11d",
      };
      return (
        weatherIcons[
          icons[code as keyof typeof icons] as keyof typeof weatherIcons
        ] || "☁️"
      );
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationError(true);
            setWeather({
              city: "Osnabrueck",
              temp: "24°C",
              condition: "Sunny",
              icon: "☀️",
            });
          },
          { timeout: 5000 }
        );
      } else {
        setLocationError(true);
        setWeather({
          city: "Osnabrueck",
          temp: "24°C",
          condition: "Sunny",
          icon: "☀️",
        });
      }
    };

    getLocation();
    const interval = setInterval(getLocation, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-body">
      <div className="dash-details">
        <div className="time">
          <div className="day">
            <h3>{getFormattedDate(currentDate)}</h3>
            <h2>{currentDate.getDate()}</h2>
          </div>
          <div className="real-time">
            <h3>{getDayName(currentDate)}</h3>
            <h2>{formatTime(time)}</h2>
          </div>
        </div>
        <div className="weather">
          <div className="weather-img">
            <h3>{weather.icon}</h3>
          </div>
          <div className="live-weather">
            <h3>{weather.city}</h3>
            <h2>{weather.temp}</h2>
            <p>{weather.condition}</p>
            {locationError && (
              <small className="location-warning">
                Using default location - allow browser location access for
                accurate data
              </small>
            )}
          </div>
        </div>
      </div>
      <div className="termin">
        <div className="dates">
          <h2>Dates</h2>
        </div>
        <div
          className="termin-details"
          contentEditable={isEditing}
          onClick={handleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
        >
          {text}
        </div>
      </div>
      <div className="present">
        <div className="present-title">
          <h2>Present</h2>
        </div>
        {workers
          .filter((worker) => {
            const today = new Date();
            const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(
              today.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${today.getFullYear()}`;
            const todaySchedule = schedule[worker.id]?.[todayStr];
            return (
              !todaySchedule ||
              todaySchedule.type === "work" ||
              !todaySchedule.type
            );
          })
          .map((worker) => {
            const today = new Date();
            const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(
              today.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${today.getFullYear()}`;
            const todaySchedule = schedule[worker.id]?.[todayStr];

            return (
              <div className="present-person" key={worker.id}>
                <div className="person-img">
                  <img src={defaultUser} alt="" />
                </div>
                <div className="person-details">
                  <h2>{worker.name}</h2>
                  <h3>{worker.role}</h3>
                  <h3>
                    {todaySchedule?.start && todaySchedule?.end
                      ? `${todaySchedule.start} - ${todaySchedule.end}`
                      : "Not scheduled"}
                  </h3>
                </div>
              </div>
            );
          })}
      </div>
      <div className="absent">
        <div className="absent-title">
          <h2>Absent</h2>
        </div>
        <div className="absent-person-main">
        {getTodaysAbsentWorkers(employers).map((worker) => {
          const today = new Date();
          const todayStr = `${today.getDate().toString().padStart(2, "0")}/${(
            today.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${today.getFullYear()}`;
          const todaySchedule = schedule[parseInt(worker.id)]?.[todayStr];

          let absentImg = sickImg;
          let absentReason = "Sick Day";

          if (todaySchedule?.type === "free") {
            absentImg = freeImg;
            absentReason = "Day Off";
          } else if (todaySchedule?.type === "parental") {
            absentImg = parentalImg;
            absentReason = "Parental Leave";
          }

          return (
            <div className="absent-person" key={worker.id}>
              <div className="absent-img">
                <img src={defaultUser} alt="User" />
              </div>
              <div className="absent-details">
                <h2>{worker.name}</h2>
                <h3>{worker.role}</h3>
                <div className="absent-reason">
                  <img src={absentImg} alt={absentReason} />
                  {absentReason}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default Body;