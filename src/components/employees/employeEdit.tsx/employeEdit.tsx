import React, { useState } from "react";

type Employer = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
};

type EmployeEditProps = {
  employer: Employer;
  onSave: (employer: Employer) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

const EmployeEdit: React.FC<EmployeEditProps> = ({
  employer,
  onSave,
  onDelete,
  onClose,
}) => {
  const [currentEmployer, setCurrentEmployer] = useState<Employer>(employer);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEmployer({ ...currentEmployer, [name]: value });
  };

  const handleSave = () => {
    const fillId = currentEmployer.id.trim();
    const fillName = currentEmployer.name.trim();
    const fillRole = currentEmployer.role.trim();

    if (!fillId || !fillName || !fillRole) {
      setError("Id, Name and Role are required.");
      return;
    }

    setError("");
    onSave(currentEmployer);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Employee</h3>

        {(Object.keys(currentEmployer) as (keyof Employer)[]).map((key) => (
          <div key={key} className="form-group">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              name={key}
              value={currentEmployer[key]}
              onChange={handleChange}
              className="inputEmployer"
            />
          </div>
        ))}

        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onDelete(currentEmployer.id)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeEdit;