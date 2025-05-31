import React, { useEffect, useState } from "react";  
import "./working.css";
import WorkingHours from "./workingHours";

type Props = {
    employers: Employer[];
    setEmployers: React.Dispatch<React.SetStateAction<Employer[]>>;
  };
  
  type Employer = {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: string;
  };

function Working({ employers }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentEmployer, setCurrentEmployer] = useState<Employer | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    useEffect(() => {
      localStorage.setItem("employees", JSON.stringify(employers));
    }, [employers]);
  
    const editEmployer = (employer: Employer) => {
      setCurrentEmployer(employer);
      setShowEditForm(true);
    };
  
    const filteredEmployees = employers.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const employeesPerPage = 40;
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    const startIndex = (currentPage - 1) * employeesPerPage;
    const currentEmployees = filteredEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );
  
    const handlePageClick = (page: React.SetStateAction<number>) => {
      setCurrentPage(page);
    };
  
    return (
      <div className="emplyees-main">
        <div className="header-employee">
          <h1>Working Hours</h1>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-bar"
          />
        </div>
  
        {showEditForm && currentEmployer && (
          <WorkingHours
            employer={currentEmployer}
            onClose={() => setShowEditForm(false)}
          />
        )}
  
        <div className="employees-table-wrapper">
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp.id} onClick={() => editEmployer(emp)}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

export default Working;