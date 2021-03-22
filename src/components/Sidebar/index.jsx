import style from "./sidebar.module.scss";
import React, { useEffect, useState } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { contests } from "../../state/contests";
import { paintMap } from "../../state/map";
import { getPrecinctData } from "../../state/map/promises";
import { groupBy, flattenDeep, orderBy, isEmpty } from "lodash";
import Table from "../Table";

const Sidebar = ({
  selectedMapData,
  setSelectedMapData,
  totalData,
  setTotalData,
  selectedYear,
  setSelectedYear,
  selectedContest,
  setSelectedContest,
  map,
  setIsSpinning,
}) => {
  const years = [2012, 2014, 2016, 2018, 2020];
  const [contestList, setContestList] = useState([]);

  useEffect(async () => {
    const { data } = await contests(selectedYear);
    setContestList(data.Items);
    const initContest = data.Items.find((item) => item.Contest === "President/Vice President");
    setSelectedContest(initContest);
    const initPrecinctResponse = await getPrecinctData("total", initContest);
    setTotalData(initPrecinctResponse.data.Items);
    paintMap(map, selectedYear, initContest.Contest, setIsSpinning);
  }, [map]);

  const columns = [
    {
      name: "Candidate",
      render: (d) => `${d.candidate}`,
    },
    {
      name: "Candidate",
      render: (d) => d.party,
    },
    {
      name: "Votes",
      render: (d) => d.totalVotes,
    },
  ];

  let resultData = [];
  if (!isEmpty(selectedMapData)) {
    const tableData = Object.keys(selectedMapData).map((key) => selectedMapData[key]);
    const resultDataGrouped = groupBy(flattenDeep(tableData.map((d) => d.results)), "Candidate");

    resultData = Object.keys(resultDataGrouped).map((key) => {
      const party = resultDataGrouped[key][0].Party;
      const candidate = key;
      const totalVotes = resultDataGrouped[key].map((d) => parseInt(d["Candidate Votes"])).reduce((a, b) => a + b);
      return { candidate, party, totalVotes };
    });
  } else {
    resultData = orderBy(
      totalData.map((d) => ({
        party: d.Party,
        candidate: d.Candidate,
        totalVotes: parseInt(d["Candidate Votes"]),
      })),
      ["totalVotes"],
      ["desc"]
    );
  }

  console.log(resultData);

  return (
    <div className={style.container}>
      <div className={style.title}>Colorado Elections: Precinct Level Results 2012 - 2020</div>
      <div className={style.yearsContainer}>
        {years.map((year, i) => (
          <div
            key={i}
            className={`${style.year} ${year === selectedYear ? style.selected : ""}`}
            onClick={async () => {
              setSelectedYear(year);
              const { data } = await contests(year);
              setContestList(data.Items);
              const initContest = data.Items.find((item) =>
                [2012, 2016, 2020].includes(year) ? item.Contest.startsWith("President/Vice President") : item.Contest.startsWith("Governor")
              );
              setSelectedContest(initContest);
              map.selectedContest = initContest;
              setSelectedMapData({});
              const initPrecinctResponse = await getPrecinctData("total", initContest);
              setTotalData(initPrecinctResponse.data.Items);
              paintMap(map, year, initContest.Contest, setIsSpinning);
            }}
          >
            {year}
          </div>
        ))}
      </div>
      <div className={style.contestSelectContainer}>
        <div>Political Contest:</div>
        <Select
          items={contestList}
          itemRenderer={(item, { modifiers, handleClick }) => (
            <MenuItem key={item.Contest} text={item.Contest} label={item.Year} active={modifiers.active} onClick={handleClick} />
          )}
          onItemSelect={async (item, e) => {
            setSelectedContest(item);
            setSelectedMapData({});
            const initPrecinctResponse = await getPrecinctData("total", item);
            setTotalData(initPrecinctResponse.data.Items);
            map.selectedContest = item;
            paintMap(map, selectedYear, item.Contest, setIsSpinning);
          }}
          activeItem={selectedContest}
        >
          <Button className={style.button} text={!!selectedContest ? selectedContest.Contest : ""} rightIcon="caret-down" />
        </Select>
      </div>
      <div className={style.selectedPrecinctsList}>
        <div className={style.listTitle}>Selected Precincts: </div>
        <div className={style.list}>{Object.keys(selectedMapData).join(", ")}</div>
      </div>
      <div className={style.tableContainer}>
        <Table data={orderBy(resultData, ["totalVotes"], ["desc"])} columns={columns} />
      </div>
    </div>
  );
};

export default Sidebar;
