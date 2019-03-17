const findMatchesInPath = require("@gvhinks/epl-data-reader").default;
const writeToDB = require("@gvhinks/epl-data-to-db").default;

(async function tester() {
  const stuff = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
  if (!writeToDB(stuff)) {
    console.error("failed to write to db");
  }
  if (stuff) console.log("we got stuff")
})();
