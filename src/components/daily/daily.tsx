import { useState } from "react";
import "./daily.css";
import left from "../../assets/daily/left.png";
import right from "../../assets/daily/right.png";
import WorkPlannerModal from "../daily/workplanner/workPlannerModal";
import freeImg from "../../assets/absent-reason/dayOff.png";
import sickImg from "../../assets/absent-reason/sickDay.png";
import parentalImg from "../../assets/absent-reason/parental_leave.png";
import { useSchedule } from "../body/scheduleContext";

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
  employers: Employer[];
};

type ActiveCell = {
  workerId: number;
  date: string;
} | null;

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Daily({ employers }: Props) {
  const { schedule, setSchedule } = useSchedule();
  const workers = employers.map((e) => ({
    id: parseInt(e.id),
    name: e.name,
    role: e.role
  }));
  
  const [activeCell, setActiveCell] = useState<ActiveCell>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  function getWeekDates(weekOffset: number) {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    const currentDay = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    return daysOfWeek.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      
      return {
        dayName: day,
        date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      };
    });
  }

  const currentWeekDates = getWeekDates(currentWeekOffset);

  function calculateDuration(start: string, end: string) {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    let duration = endH * 60 + endM - (startH * 60 + startM);
    if (duration < 0) duration += 1440;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} hrs ${minutes} mins`;
  }

  function openPlanner(workerId: number, date: string) {
    setActiveCell({ workerId, date });
  }

  function closePlanner() {
    setActiveCell(null);
  }

  function savePlanner(
    workerId: number,
    date: string,
    dayName: string,
    start: string | null,
    end: string | null,
    type: "work" | "free" | "parental" | "sick"
  ) {
    setSchedule((prev) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [date]: {
          ...(start && end ? { start, end } : {}),
          type,
          dayName,
        },
      },
    }));
    closePlanner();
  }

  function clearSchedule() {
    if (window.confirm("Are you sure you want to clear ALL schedule data?")) {
      setSchedule({});
    }
  }

  function clearCurrentWeek() {
    if (window.confirm("Are you sure you want to clear this week's schedule?")) {
      setSchedule(prev => {
        const newSchedule = {...prev};
        currentWeekDates.forEach(({ date }) => {
          workers.forEach(worker => {
            if (newSchedule[worker.id]?.[date]) {
              delete newSchedule[worker.id][date];
            }
          });
        });
        return newSchedule;
      });
    }
  }

  const handlePrevWeek = () => setCurrentWeekOffset(prev => prev - 1);
  const handleNextWeek = () => setCurrentWeekOffset(prev => prev + 1);
  const handleToday = () => setCurrentWeekOffset(0);

  return (
    <div className="daily-main">
      <div className="daily-header">
        <h1>Daily Plan</h1>
        <div className="header-actions">
          <div className="header-selector">
            <button onClick={handlePrevWeek}>
              <img src={left} alt="Previous" />
            </button>
            <button className="today-btn" onClick={handleToday}>Today</button>
            <button onClick={handleNextWeek}>
              <img src={right} alt="Next" />
            </button>
          </div>
          <div className="clear-buttons">
            <button className="clear-week-btn" onClick={clearCurrentWeek}>
              Clear This Week
            </button>
            <button className="clear-btn" onClick={clearSchedule}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="plan-main">
        <div className="day-plan">
          <table className="plan-table">
            <thead>
              <tr>
                <th>Worker</th>
                {currentWeekDates.map(({ dayName, date }) => (
                  <th key={date}>
                    <div>{dayName}</div>
                    <div className="date-label">{date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.name}</td>
                  {currentWeekDates.map(({ dayName, date }) => {
                    const data = schedule[worker.id]?.[date];
                    const isActive = activeCell?.workerId === worker.id && activeCell?.date === date;

                    return (
                      <td key={date} className={`plan-cell ${data?.type || ""}`}>
                        {isActive ? (
                          <WorkPlannerModal
                            workerName={worker.name}
                            initialStart={data?.start || ""}
                            initialEnd={data?.end || ""}
                            initialType={data?.type || "work"}
                            onSave={(start, end, type) =>
                              savePlanner(worker.id, date, dayName, start, end, type)
                            }
                            onClose={closePlanner}
                          />
                        ) : data?.type === "parental" ? (
                          <div onClick={() => openPlanner(worker.id, date)} className="plan-entry">
                            <div className="plan-parental">
                              <img src={parentalImg} alt="" />
                              Parental
                            </div>
                          </div>
                        ) : data?.type === "sick" ? (
                          <div onClick={() => openPlanner(worker.id, date)} className="plan-entry">
                            <div className="plan-sick">
                              <img src={sickImg} alt="" />
                              Sick
                            </div>
                          </div>
                        ) : data?.type === "free" ? (
                          <div onClick={() => openPlanner(worker.id, date)} className="plan-entry">
                            <div className="plan-free">
                              <img src={freeImg} alt="" />
                              Free
                            </div>
                          </div>
                        ) : data?.start && data?.end ? (
                          <div onClick={() => openPlanner(worker.id, date)} className="plan-entry">
                            <div className="entry-time">
                              {data.start} - {data.end}
                            </div>
                            <div className="entry-hours">
                              {calculateDuration(data.start, data.end)}
                            </div>
                          </div>
                        ) : (
                          <div className="add-btn" onClick={() => openPlanner(worker.id, date)}>
                            +
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Daily;