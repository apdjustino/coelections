import style from "./sidebar.module.scss";
import React from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, Select } from "@blueprintjs/select";

const Sidebar = ({ selectedYear, setSelectedYear, selectedContest, setSelectedContest }) => {
  const years = [2012, 2014, 2016, 2018, 2020];
  const testItems = ["President/Vice President", "U.S. Senator", "House Representative"];
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
      <div className={style.contestSelectContainer}>
        <Select
          items={testItems}
          itemRenderer={(item, { modifiers, handleClick }) => <MenuItem key={item} text={item} active={modifiers.active} onClick={handleClick} />}
          onItemSelect={(item, e) => {
            console.log(item);
          }}
        >
          <Button text={testItems[0]} rightIcon="caret-down" />
        </Select>
      </div>
    </div>
  );
};

export default Sidebar;
