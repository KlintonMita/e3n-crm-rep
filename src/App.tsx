import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Body from "./components/body/body";
import Employees from "./components/employees/employees";
import Daily from "./components/daily/daily";
import { useEffect, useState } from "react";
import { ScheduleProvider } from "./components/body/scheduleContext";
import Working from "./components/workingHours/working";

type Employer = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
};

function App() {
  const [employers, setEmployers] = useState<Employer[]>(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employers));
  }, [employers]);

  return (
    <div className="main">
      <ScheduleProvider>
        <Router>
          <Header />
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="main-frame">
                  <Body employers={employers} />
                </div>
              } 
            />
            <Route
              path="/employees"
              element={
                <div className="main-frame">
                  <Employees employers={employers} setEmployers={setEmployers} />
                </div>
              }
            />
            <Route
              path="/daily"
              element={
                <div className="main-frame">
                  <Daily employers={employers} />
                </div>
              }
            />
            <Route path="/working" element={<div className="main-frame">
              <Working employers={employers} setEmployers={setEmployers}/>
            </div>} />
          </Routes>
        </Router>
      </ScheduleProvider>
    </div>
  );
}

export default App;