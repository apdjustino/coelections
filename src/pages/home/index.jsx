import React, { useState, useEffect } from "react";
import Map from "../../components/Map";
const HomePage = () => {
  const [lng, setLng] = useState(-104.9951972);
  const [lat, setLat] = useState(39.7645187);
  const [zoom, setZoom] = useState(11);
  const [map, setMap] = useState(null);
  const [selectedMapData, setSelectedMapData] = useState({});
  console.log(selectedMapData);
  return (
    <div>
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
      />
    </div>
  );
};

export default HomePage;
