import { getMapData, getPrecinctData } from "./promises";

export const initMapState = (map) => {
  map.on("load", () => {
    console.log("loaded");
    map.addSource("precincts", {
      type: "vector",
      url: "mapbox://adams-county-dems.86piddr5",
    });

    map.addLayer({
      id: "precincts",
      type: "fill",
      source: "precincts",
      "source-layer": "precincts1-3jd2ar",
      paint: {
        "fill-outline-color": "black",
        "fill-color": "rgba(0,0,0,0.01)",
      },
    });

    map.addLayer({
      id: "precincts-selected",
      type: "fill",
      source: "precincts",
      "source-layer": "precincts1-3jd2ar",
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
      "source-layer": "precincts1-3jd2ar",
      paint: {
        "line-color": "black",
        "line-width": 0.5,
      },
    });

    map.addLayer({
      id: "precincts-border-hover",
      type: "line",
      source: "precincts",
      "source-layer": "precincts1-3jd2ar",
      paint: {
        "line-color": "black",
        "line-width": 1.5,
      },
      filter: ["==", ["get", "NAME"], ""],
    });
  });
};

export const handleMapClick = async (map, setSelectedMapData, e) => {
  const bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5],
  ];
  const features = map.queryRenderedFeatures(bbox, { layers: ["precincts"] });
  const clickedFeature = features[0];
  console.log(clickedFeature);
  let featureProperties = {};
  if (!!clickedFeature) {
    featureProperties = features[0].properties;
    // make request to API for precinct and turnout results
    const precinctResponse = await getPrecinctData(featureProperties.NAME, map.selectedContest);
    console.log(precinctResponse);
  } else {
    return;
  }

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

export const mapData = async (year, contest) => {
  let results = {};
  try {
    const mapData = await getMapData(year, contest);
    results = mapData;
  } catch (error) {
    console.log(error);
  }
  return results;
};

export const paintMap = async (map, year, contest) => {
  try {
    const { data } = await getMapData(year, contest);
    const { Items } = data;
    console.log(Items);
    const filterStatement = ["match", ["get", "NAME"]];
    const paintStatement = ["match", ["get", "NAME"]];
    Items.forEach((item) => {
      filterStatement.push(item.Precinct, true);
      paintStatement.push(item.Precinct, item["Winning Party"] === "Democratic Party" || item["Winning Party"] === "yes" ? "blue" : "red");
    });
    filterStatement.push(false);
    paintStatement.push("rgba(0,0,0,0.01)");
    map.setFilter("precincts", filterStatement);
    map.setFilter("precincts-border", filterStatement);
    map.setFilter("precincts-border-hover", filterStatement);
    map.setPaintProperty("precincts", "fill-opacity", 0.35);
    map.setPaintProperty("precincts", "fill-color", paintStatement);
  } catch (error) {
    console.log(error);
  }
};
