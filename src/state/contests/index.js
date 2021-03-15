import { getContests } from "./promises";

export const contests = async (year) => {
  let results = [];
  try {
    const politicalContests = await getContests(year);
    results = politicalContests;
  } catch (error) {
    console.log(error);
  }
  return results;
};
