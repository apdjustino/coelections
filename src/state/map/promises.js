import { Client } from "../../configuration/client";

export const getMapData = (year, contest) => {
  const key = btoa(`${year}-${contest}`);
  return Client.get(`map/${key}`);
};

export const getPrecinctData = (precinct, contest) => {
  const { Year, Contest } = contest;
  const key = btoa(`${precinct}-${Year}-${Contest}`);
  return Client.get(`precincts/${key}`);
};
