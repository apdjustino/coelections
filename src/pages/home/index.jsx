import style from "./home.module.scss";

import React, { useState, useEffect } from "react";
import { Spinner } from "@blueprintjs/core";
import Map from "../../components/Map";
import Sidebar from "../../components/Sidebar";
const HomePage = () => {
  const [lng, setLng] = useState(-104.9951972);
  const [lat, setLat] = useState(39.7645187);
  const [zoom, setZoom] = useState(11);
  const [map, setMap] = useState(null);
  const [selectedMapData, setSelectedMapData] = useState({});
  const [selectedYear, setSelectedYear] = useState(2020);
  const [selectedContest, setSelectedContest] = useState("");
  const [isSpinning, setIsSpinning] = useState(true);
  const [totalData, setTotalData] = useState([]);

  return (
    <div className={style.container}>
      {isSpinning ? <Spinner className={style.spinner} /> : null}
      <Map
        map={map}
        lng={lng}
        lat={lat}
        zoom={zoom}
        setLng={setLng}
        setLat={setLat}
        setZoom={setZoom}
        setMap={setMap}
        selectedMapData={selectedMapData}
        setSelectedMapData={setSelectedMapData}
        selectedContest={selectedContest}
      />
      <Sidebar
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedContest={selectedContest}
        setSelectedContest={setSelectedContest}
        map={map}
        setIsSpinning={setIsSpinning}
        selectedMapData={selectedMapData}
        setSelectedMapData={setSelectedMapData}
        totalData={totalData}
        setTotalData={setTotalData}
      />
    </div>
  );
};

export default HomePage;
