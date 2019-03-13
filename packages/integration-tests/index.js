const findMatchesInPath = require("@gvhinks/epl-data-reader").default;

(async function tester() {
  const stuff = await findMatchesInPath("/Users/ghinks/dev/match-analysis/packages/epl-data-reader/data");
  if (stuff) console.log("we got stuff")
})();
