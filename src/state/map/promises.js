import { Client } from "../../configuration/client";

export const getMapData = (year, contest) => {
  const key = btoa(`${year}-${contest}`);
  return Client.get(`map/${key}`);
};

export const getPrecinctData = (precinct, contest, resultsOnly = true) => {
  const { Year, Contest } = contest;
  const key = btoa(`${precinct}-${Year}-${Contest}`);
  if (resultsOnly) {
    return Client.get(`precincts/${key}`);
  } else {
    const turnoutKey = btoa(`${Year}-${precinct.toUpperCase()}`);
    const resultsRequest = Client.get(`precincts/${key}`);
    const turnoutRequest = Client.get(`turnout/${turnoutKey}`);
    return Promise.all([resultsRequest, turnoutRequest]);
  }
};
