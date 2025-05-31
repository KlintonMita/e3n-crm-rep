import React, { useState, useEffect } from "react";
import "./employees.css";
import EmployeEdit from "./employeEdit.tsx/employeEdit";

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

function Employees({ employers, setEmployers }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [newEmployer, setNewEmployer] = useState<Employer>({
    id: "",
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    status: "",
  });
  const [currentEmployer, setCurrentEmployer] = useState<Employer | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employers));
  }, [employers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployer({ ...newEmployer, [name]: value });
  };

  const handleSave = () => {
    const fillId = newEmployer.id.trim();
    const fillName = newEmployer.name.trim();
    const fillRole = newEmployer.role.trim();

    if (!fillId || !fillName || !fillRole) {
      setError("Id, Name and Role are required.");
      return;
    }

    const idExist = employers.some((emp) => emp.id === fillId);
    if (idExist) {
      setError("Id must be unique.");
      return;
    }

    setError("");
    setEmployers([...employers, newEmployer]);
    setNewEmployer({
      id: "",
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      status: "",
    });
    setShowForm(false);
  };

  const editEmployer = (employer: Employer) => {
    setCurrentEmployer(employer);
    setShowEditForm(true);
  };

  const handleUpdateEmployer = (updatedEmployer: Employer) => {
    setEmployers(employers.map(emp => 
      emp.id === updatedEmployer.id ? updatedEmployer : emp
    ));
    setShowEditForm(false);
  };

  const handleDeleteEmployer = (id: string) => {
    setEmployers(employers.filter(emp => emp.id !== id));
    setShowEditForm(false);
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
        <h1>Employees</h1>
        <button className="add-button" onClick={() => setShowForm(true)}>
          + Add Employee
        </button>
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

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Employee</h3>

            {(Object.keys(newEmployer) as (keyof Employer)[]).map((key) => (
              <div key={key} className="form-group">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type="text"
                  name={key}
                  value={newEmployer[key]}
                  onChange={handleChange}
                  className="inputEmployer"
                />
              </div>
            ))}

            {error && <p className="error-text">{error}</p>}

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && currentEmployer && (
        <EmployeEdit
          employer={currentEmployer}
          onSave={handleUpdateEmployer}
          onDelete={handleDeleteEmployer}
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

export default Employees;