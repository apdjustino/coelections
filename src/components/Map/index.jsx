import style from "./map.module.scss";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import { initMapState, handleMapClick, handleMapHover, handleMapHoverReset } from "../../state/map";

const Map = ({ lat, lng, zoom, setLng, setLat, setZoom, setMap, selectedMapData, setSelectedMapData }) => {
  const mapContainer = useRef();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    initMapState(map);
    map.selectedMapData = {};
    map.on("click", (e) => handleMapClick(map, setSelectedMapData, e));
    map.on("mousemove", "precincts", (e) => handleMapHover(map, e));

    setMap(map);
    return () => map.remove();
  }, []);

  return <div className={style.map} ref={mapContainer} />;
};

export default Map;
