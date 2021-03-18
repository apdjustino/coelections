import { Client } from "../../configuration/client";

export const getMapData = (year, contest) => {
  const key = btoa(`${year}-${contest}`);
  return Client.get(`map/${key}`);
};
