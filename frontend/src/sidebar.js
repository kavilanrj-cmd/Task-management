import React from "react";
import {
  FaHome,
  FaTasks,
  FaChartBar,
  FaCalendarAlt,
  FaCog
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>TaskFlow</h2>

      <ul>
        <li><FaHome /> Dashboard</li>
        <li><FaTasks /> Tasks</li>
        <li><FaCalendarAlt /> Calendar</li>
        <li><FaChartBar /> Analytics</li>
        <li><FaCog /> Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;