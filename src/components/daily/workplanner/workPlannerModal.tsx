import React, { useState, useEffect } from "react";
import "../workplanner/workPlannerModal.css";

type Props = {
  workerName: string;
  initialStart?: string;
  initialEnd?: string;
  initialType?: "work" | "free" | "parental" | "sick";
  onSave: (
    start: string | null,
    end: string | null,
    type: "work" | "free" | "parental" | "sick"
  ) => void;
  onClose: () => void;
};

const WorkPlannerModal: React.FC<Props> = ({
  workerName,
  initialStart = "",
  initialEnd = "",
  initialType = "work",
  onSave,
  onClose,
}) => {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [isFree, setIsFree] = useState(initialType === "free");
  const [isParentalLeave, setParentalLeave] = useState(
    initialType === "parental"
  );
  const [isSick, setSick] = useState(
    initialType === "sick"
  );

  useEffect(() => {
    setStart(initialStart);
    setEnd(initialEnd);
    setIsFree(initialType === "free");
    setParentalLeave(initialType === "parental");
    setSick(initialType === "sick");
  }, [initialStart, initialEnd, initialType]);

  const handleFreeChange = (checked: boolean) => {
    setIsFree(checked);
    if (checked) {
      setParentalLeave(false);
      setSick(false);
    };
  };

  const handleParentalChange = (checked: boolean) => {
    setParentalLeave(checked);
    if (checked) {
      setIsFree(false);
      setSick(false);
    }
  };

  const handleSick = (checked: boolean) => {
    setSick(checked);
    if (checked) {
      setIsFree(false);
      setParentalLeave(false);
    }
  }

  const handleSave = () => {
    if (isParentalLeave) {
      onSave(null, null, "parental");
    } else if (isFree) {
      onSave(null, null, "free");
    } else if (isSick) {
      onSave(null, null, "sick");
    } else {
      onSave(start, end, "work");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{workerName} - Plan Shift</h3>

        <label>
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => handleFreeChange(e.target.checked)}
          />
          Free day / Staying at home
        </label>

        <label>
          <input
            type="checkbox"
            checked={isParentalLeave}
            onChange={(e) => handleParentalChange(e.target.checked)}
          />
          Parental Leave
        </label>

        <label>
          <input
            type="checkbox"
            checked={isSick}
            onChange={(e) => handleSick(e.target.checked)}
          />
          Sick
        </label>

        {!isFree && !isParentalLeave && !isSick && (
          <>
            <label>Start Time</label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />

            <label>End Time</label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </>
        )}

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default WorkPlannerModal;
