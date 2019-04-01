import findMatchesInPath, { MatchResult } from "@gvhinks/epl-data-reader";
import writeToDB from "@gvhinks/epl-data-to-db";
import { read } from "fs";

const readTheData = async () => {
  const stuff: MatchResult[] = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
  const result = await writeToDB(stuff);
};

readTheData()
  .then(() => console.info("completed"))
  .catch(err => console.error(err.message));
