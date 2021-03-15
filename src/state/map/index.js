export const initMapState = (map) => {
  map.on("load", () => {
    console.log("loaded");
    map.addSource("precincts", {
      type: "vector",
      url: "mapbox://adams-county-dems.6hs6fbtx",
    });

    map.addLayer({
      id: "precincts",
      type: "fill",
      source: "precincts",
      "source-layer": "CO_precincts-cd33af",
      paint: {
        "fill-outline-color": "black",
        "fill-color": "rgba(0,0,0,0.01)",
      },
    });

    map.addLayer({
      id: "precincts-selected",
      type: "fill",
      source: "precincts",
      "source-layer": "CO_precincts-cd33af",
      paint: {
        "fill-outline-color": "black",
        "fill-color": "yellow",
        "fill-opacity": 0.33,
      },
      filter: ["==", ["get", "NAME"], ""],
    });

    map.addLayer({
      id: "precincts-border",
      type: "line",
      source: "precincts",
      "source-layer": "CO_precincts-cd33af",
      paint: {
        "line-color": "black",
        "line-width": 0.5,
      },
    });

    map.addLayer({
      id: "precincts-border-hover",
      type: "line",
      source: "precincts",
      "source-layer": "CO_precincts-cd33af",
      paint: {
        "line-color": "black",
        "line-width": 1.5,
      },
      filter: ["==", ["get", "NAME"], ""],
    });
  });
};

export const handleMapClick = (map, setSelectedMapData, e) => {
  const bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5],
  ];
  const features = map.queryRenderedFeatures(bbox, { layers: ["precincts"] });
  const featureProperties = features[0].properties;
  const precinctId = `${featureProperties.CD116FP.slice(1)}${featureProperties.SLDUST.slice(1)}${featureProperties.SLDLST.slice(
    1
  )}${featureProperties.VTDST.slice(1)}`;
  // make request to API for precinct and turnout results

  let updatedSelectedMapData = { ...map.selectedMapData };
  if (map.selectedMapData[featureProperties.NAME] !== undefined) {
    delete updatedSelectedMapData[featureProperties.NAME];
  } else {
    updatedSelectedMapData[featureProperties.NAME] = featureProperties;
  }

  setSelectedMapData(updatedSelectedMapData);
  map.selectedMapData = updatedSelectedMapData;

  const paintExpression = ["match", ["get", "NAME"]];
  const defaultExpression = ["==", ["get", "NAME"], ""];
  Object.keys(updatedSelectedMapData).forEach((key) => {
    paintExpression.push(updatedSelectedMapData[key].NAME, true);
  });
  paintExpression.push(false);
  map.setFilter("precincts-selected", Object.keys(updatedSelectedMapData).length > 0 ? paintExpression : defaultExpression);
};

export const handleMapHover = (map, e) => {
  const bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5],
  ];
  const features = map.queryRenderedFeatures(bbox, { layers: ["precincts"] });
  const featureProperties = features[0].properties;
  const filterExpression = ["==", ["get", "NAME"], featureProperties.NAME];
  map.setFilter("precincts-border-hover", filterExpression);
};

export const handleMapHoverReset = (map) => {
  map.setFilter("precincts-border-hover", ["==", ["get", "NAME"], ""]);
};
