import React from "react";
import Todo from "../Assets/icons_FEtask/Todo.svg";
import progress from "../Assets/icons_FEtask/progress.svg";
import Done from "../Assets/icons_FEtask/Done.svg";
import Cancelled from "../Assets/icons_FEtask/Cancelled.svg";
import Backlog from "../Assets/icons_FEtask/Backlog.svg";


// Function to get initials and color based on availability
const getInitialsAndColor = (name, isAvailable) => {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const color = isAvailable ? "#4CAF50" : "#F44336"; // Green for available, red for unavailable
  return { initials, color };
};

const Card = ({
  id,
  title,
  tag,
  userId,
  userData,
  status,
  priority,
  grouping,
  ordering,
  statusMapping,
}) => {
  const user = userData.find((user) => user.id === userId);
  const isAvailable = user ? user.available : true; // Default to true if user not found
  const userName = user ? user.name : "Unknown User"; // Fallback if user not found
  const { initials, color } = getInitialsAndColor(userName, isAvailable); // Get initials and color

  return (
    <div className="card">
      <div className="card-header">
        <div className="status-heading">
          {grouping === "users" || grouping === "priority" ? (
            statusMapping[id] === "Todo" ? (
             <img src={Todo} height="20px" width="20px" id="todo"/>
            ) : statusMapping[id] === "In progress" ? (
              <img src={progress}  height="20px" width="20px" id="progress"/>
            ) : statusMapping[id] === "Backlog" ? (
              <img src={Backlog} height="20px" width="20px" id="backlog"/>
            ) : statusMapping[id] === "Done" ? (
              <img src={Done} height="20px " width="20px" id="done"/>
            ) : (
              <img src={Cancelled} height="20px" width="20px" id="cancel" />
            )
          ) : null}
          <p>{id}</p>
        </div>
        {grouping !== "users" ? (
          <div className={`user-avatar ${isAvailable ? "" : "user-avatar-unavailable"}`}>
            {/* Display user initials instead of image */}
            <span className="initials" style={{ color }}>
              {initials}
            </span>
          </div>
        ) : null}
      </div>
      <div className="card-title">
        <p>{title}</p>
      </div>
      <div className="card-footer">
        {grouping !== "priority" ? (
          <div className="feature-container">
            {priority === "0" ? (
              <i className="bx bx-dots-horizontal-rounded"></i>
            ) : priority === "1" ? (
              <i className="bx bx-signal-2"></i>
            ) : priority === "2" ? (
              <i className="bx bx-signal-3"></i>
            ) : priority === "3" ? (
              <i className="bx bx-signal-4"></i>
            ) : (
              <i className="bx bxs-message-square-error"></i>
            )}
          </div>
        ) : null}
        {tag?.map((value, index) => {
          return (
            <div className="feature-container" key={index}>
              <div className="alert-icon"></div>
              <div className="feature-request">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
