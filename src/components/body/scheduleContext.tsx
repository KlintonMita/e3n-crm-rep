import { createContext, useContext, useState, useEffect } from 'react';

type Employer = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
};

type ScheduleEntry = {
  start?: string;
  end?: string;
  type?: "work" | "free" | "parental" | "sick";
  dayName?: string;
};

type Schedule = {
  [workerId: number]: {
    [date: string]: ScheduleEntry;
  };
};

const STORAGE_KEY = "workScheduleData";

type ScheduleContextType = {
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
  getTodaysWorkers: (employers: Employer[]) => Employer[];
};

const ScheduleContext = createContext<ScheduleContextType>({
  schedule: {},
  setSchedule: () => {},
  getTodaysWorkers: () => []
});

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  const getTodaysWorkers = (employers: Employer[]): Employer[] => {
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    return employers.filter(employer => {
      const workerId = parseInt(employer.id);
      const workerSchedule = schedule[workerId]?.[todayStr];
      return workerSchedule && workerSchedule.type === "work";
    });
  };

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule, getTodaysWorkers }}>
      {children}
    </ScheduleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSchedule = () => useContext(ScheduleContext);