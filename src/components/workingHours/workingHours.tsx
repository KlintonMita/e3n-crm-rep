import React, { useState, useEffect } from "react";
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

type WorkingHoursProps = {
  employer: Employer;
  onClose: () => void;
};

type WorkDay = {
  date: string;
  dayName?: string;
  start: string;
  end: string;
  duration: string;
  type: string;
};

const WorkingHours: React.FC<WorkingHoursProps> = ({
  employer,
  onClose,
}) => {
  const { schedule } = useSchedule();
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [totalHours, setTotalHours] = useState<string>("0 hrs 0 mins");

  useEffect(() => {
    if (schedule[parseInt(employer.id)]) {
      const employeeSchedule = schedule[parseInt(employer.id)];
      const days: WorkDay[] = [];
      let totalMinutes = 0;

      Object.entries(employeeSchedule).forEach(([date, data]) => {
        if (data.type === "work" && data.start && data.end) {
          const [startH, startM] = data.start.split(":").map(Number);
          const [endH, endM] = data.end.split(":").map(Number);
          let duration = endH * 60 + endM - (startH * 60 + startM);
          if (duration < 0) duration += 1440;
          
          totalMinutes += duration;
          
          days.push({
            date,
            dayName: data.dayName,
            start: data.start,
            end: data.end,
            duration: `${Math.floor(duration / 60)} hrs ${duration % 60} mins`,
            type: data.type
          });
        }
      });

      setWorkDays(days);
      setTotalHours(`${Math.floor(totalMinutes / 60)} hrs ${totalMinutes % 60} mins`);
    }
  }, [employer.id, schedule]);

  return (
    <div className="modal-overlay">
      <div className="modal-content working-hours-modal">
        <h3>Working Hours for {employer.name}</h3>
        
        <div className="total-hours">
          <h4>Total Hours Worked: {totalHours}</h4>
        </div>
        
        <div className="work-days-list">
          <h4>Work Days:</h4>
          {workDays.length > 0 ? (
            <table className="work-days-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {workDays.map((day, index) => (
                  <tr key={index}>
                    <td>{day.dayName}</td>
                    <td>{day.date}</td>
                    <td>{day.start}</td>
                    <td>{day.end}</td>
                    <td>{day.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No work days recorded for this employee.</p>
          )}
        </div>

        <div className="employer-info">
          <h4>Employee Information:</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span>{employer.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span>{employer.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span>{employer.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span>{employer.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span>{employer.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span>{employer.status}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default WorkingHours;