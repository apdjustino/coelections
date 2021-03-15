import { Client } from "../../configuration/client";

export const getContests = (year) => Client.get(`contests/${year}`);
