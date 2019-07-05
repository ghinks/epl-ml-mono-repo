import { promises as fsPromises } from "fs";
import { MatchResult } from "../matchResult";

const findDataFiles = async (dataPath): Promise<string[]> => {
  const results = await fsPromises.readdir(dataPath);
  return results;
};

const readMatchResult = async (file): Promise<MatchResult[]> => {
  const results = await fsPromises.readFile(file, "utf8");
  const matches: MatchResult[] = JSON.parse(results) as MatchResult[];
  return matches;
};

export { findDataFiles, readMatchResult };
