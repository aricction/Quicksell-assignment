import React, { useState, useRef, useEffect } from "react";
import Display from "../Assets/icons_FEtask/Display.svg";
import down from "../Assets/icons_FEtask/down.svg";

const Navbar = ({ grouping: propGrouping, setGrouping, ordering: propOrdering, setOrdering, call }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initialGrouping = localStorage.getItem("grouping") || propGrouping;
  const initialOrdering = localStorage.getItem("ordering") || propOrdering;

  const [grouping, setLocalGrouping] = useState(initialGrouping);
  const [ordering, setLocalOrdering] = useState(initialOrdering);

  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    setGrouping(grouping);
  }, [grouping]);

  useEffect(() => {
    localStorage.setItem("ordering", ordering);
    setOrdering(ordering);
  }, [ordering]);

  // Handlers
  const handleGrouping = (event) => {
    const newValue = event.target.value;
    localStorage.setItem("grouping", newValue);
    setGrouping(newValue);
    if (newValue === "users") {
      call();
    }
  };

  const handleOrdering = (event) => {
    const newValue = event.target.value;
    localStorage.setItem("ordering", newValue);
    setOrdering(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown open state
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="Navbar">
      <div className="dropdown-container" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="dropdown-btn">
          <img src={Display} width="20px" height="20px" alt="Display Icon" />
          <div className="btn-txt">Display</div>
          <img src={down} width="20px" height="20px" alt="down Icon" />
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <div className="Grouping">
              <label>Grouping</label>
              <select value={propGrouping} onChange={handleGrouping}>
                <option value="status">Status</option>
                <option value="users">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="Ordering">
              <label>Ordering</label>
              <select value={propOrdering} onChange={handleOrdering}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
