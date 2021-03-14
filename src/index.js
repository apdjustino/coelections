import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import HomePage from "./pages/home";
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = "pk.eyJ1IjoiYWRhbXMtY291bnR5LWRlbXMiLCJhIjoiY2poZjhrMDhzMTZ5MjNhbzF2dmEzdXl1YSJ9.mIJcB8mMvQRbb-Wcl2z41w";

ReactDOM.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
