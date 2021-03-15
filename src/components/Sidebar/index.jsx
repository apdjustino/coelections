import style from "./sidebar.module.scss";
import React from "react";

const Sidebar = ({ selectedYear, setSelectedYear }) => {
  const years = [2012, 2014, 2016, 2018, 2020];
  return (
    <div className={style.container}>
      <div className={style.title}>Colorado Elections: Precinct Level Results 2012 - 2020</div>
      <div className={style.yearsContainer}>
        {years.map((year, i) => (
          <div key={i} className={`${style.year} ${year === selectedYear ? style.selected : ""}`} onClick={() => setSelectedYear(year)}>
            {year}
          </div>
        ))}
      </div>
      <div className={style.contestSelectContainer}></div>
    </div>
  );
};

export default Sidebar;
