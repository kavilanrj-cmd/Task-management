import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div
      className="stats-card"
      style={{ borderLeft: `6px solid ${color}` }}
    >
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
};

export default StatsCard;