import style from "./sidebar.module.scss";
import React, { useEffect, useState } from "react";
import { format } from "d3-format";
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
      name: "Party",
      render: (d) => d.party,
    },
    {
      name: "Votes",
      render: (d) => (d.party === "n/a" ? d.totalVotes : format(",")(d.totalVotes)),
    },
  ];

  let resultData = [];
  let turnoutData = {};
  if (!isEmpty(selectedMapData)) {
    console.log(selectedMapData);
    const tableData = Object.keys(selectedMapData).map((key) => selectedMapData[key]);
    const resultDataGrouped = groupBy(flattenDeep(tableData.map((d) => d.results)), "Candidate");

    resultData = Object.keys(resultDataGrouped).map((key) => {
      const party = resultDataGrouped[key][0].Party;
      const candidate = key;
      let totalVotes = resultDataGrouped[key].map((d) => parseInt(d["Candidate Votes"])).reduce((a, b) => a + b);
      if (party === "n/a") {
        const yesVotes = resultDataGrouped[key].map((d) => parseInt(d["Yes Votes"])).reduce((a, b) => a + b);
        const noVotes = resultDataGrouped[key].map((d) => parseInt(d["No Votes"])).reduce((a, b) => a + b);
        totalVotes = `Yes: ${yesVotes}, No: ${noVotes}`;
      }
      return { candidate, party, totalVotes };
    });

    turnoutData["Active Voters"] = Object.keys(selectedMapData)
      .map((key) => parseInt(selectedMapData[key]["turnout"][0]["Active Voters"]))
      .reduce((a, b) => a + b);

    turnoutData["Ballots Cast"] = Object.keys(selectedMapData)
      .map((key) => parseInt(selectedMapData[key]["turnout"][0]["Ballots Cast"]))
      .reduce((a, b) => a + b);

    turnoutData["Inactive Voters"] = Object.keys(selectedMapData)
      .map((key) => parseInt(selectedMapData[key]["turnout"][0]["Inactive Voters"]))
      .reduce((a, b) => a + b);

    turnoutData["Total Voters"] = Object.keys(selectedMapData)
      .map((key) => parseInt(selectedMapData[key]["turnout"][0]["Total Voters"]))
      .reduce((a, b) => a + b);
  } else {
    resultData =
      !!totalData[0] && totalData[0].Party === "n/a"
        ? totalData.map((d) => ({
            party: d.Party,
            candidate: d.Candidate,
            totalVotes: `Yes: ${d["Yes Votes"]}, No: ${d["No Votes"]}`,
          }))
        : orderBy(
            totalData.map((d) => ({
              party: d.Party,
              candidate: d.Candidate,
              totalVotes: parseInt(d["Candidate Votes"]),
            })),
            ["totalVotes"],
            ["desc"]
          );
  }
  console.log(turnoutData);
  const handleYearChange = async (year) => {
    //get contest list
    const { data } = await contests(year);
    const initContest = data.Items.find((item) =>
      [2012, 2016, 2020].includes(year) ? item.Contest.startsWith("President/Vice President") : item.Contest.startsWith("Governor")
    );
    //get total precinct data
    const initPrecinctResponse = await getPrecinctData("total", initContest);

    // set state
    setSelectedYear(year);
    setContestList(data.Items);
    setSelectedContest(initContest);
    map.selectedContest = initContest;
    map.selectedMapData = {};
    setSelectedMapData({});
    setTotalData(initPrecinctResponse.data.Items);

    //update map
    map.setFilter("precincts-selected", ["==", ["get", "NAME"], ""]);
    paintMap(map, year, initContest.Contest, setIsSpinning);
  };

  const handleContestChange = async (item, e) => {
    // get total data
    const initPrecinctResponse = await getPrecinctData("total", item);

    // update state
    setSelectedContest(item);
    setSelectedMapData({});
    setTotalData(initPrecinctResponse.data.Items);
    map.selectedMapData = {};
    map.selectedContest = item;

    //update map
    map.setFilter("precincts-selected", ["==", ["get", "NAME"], ""]);
    paintMap(map, selectedYear, item.Contest, setIsSpinning);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>Colorado Elections: Precinct Level Results 2012 - 2020</div>
      <div className={style.yearsContainer}>
        {years.map((year, i) => (
          <div key={i} className={`${style.year} ${year === selectedYear ? style.selected : ""}`} onClick={() => handleYearChange(year)}>
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
          onItemSelect={(item, e) => handleContestChange(item, e)}
          activeItem={selectedContest}
        >
          <Button className={style.button} text={!!selectedContest ? selectedContest.Contest : ""} rightIcon="caret-down" />
        </Select>
      </div>
      <div className={style.selectedPrecinctsList}>
        <div className={style.listTitle}>Selected Precincts: </div>
        <div className={style.list}>{Object.keys(selectedMapData).join(", ")}</div>
      </div>
      <div className={style.selectedPrecinctsList}>
        <div className={style.listTitle}>Turnout Statistics:</div>
        {!isEmpty(selectedMapData) ? (
          <div className={style.stats}>
            <div>Active Voters: {turnoutData["Active Voters"]}</div>
            <div>Inactive Voters: {turnoutData["Inactive Voters"]}</div>
            <div>Total Voters: {turnoutData["Total Voters"]}</div>
            <div>Ballots Cast: {turnoutData["Ballots Cast"]}</div>
            <div>Turnout: {format(".2%")(turnoutData["Ballots Cast"] / turnoutData["Total Voters"])}</div>
            <div>Under votes: {format(".2%")(1 - resultData.map((d) => d.totalVotes).reduce((a, b) => a + b) / turnoutData["Ballots Cast"])}</div>
          </div>
        ) : (
          <div>N/A</div>
        )}
      </div>
      <div className={style.tableContainer}>
        <Table data={orderBy(resultData, ["totalVotes"], ["desc"])} columns={columns} />
      </div>
    </div>
  );
};

export default Sidebar;
