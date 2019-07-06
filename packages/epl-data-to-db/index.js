const reader = require("@gvhinks/epl-data-reader");
const db = require("./dist/index");
const { getFutureGames, default: getHistoricalData} = reader;
const { writeFutureFixtures, default: writeHistoricalData } = db;

console.log("starting db import from static data files");

const populateDB = async () => {
  const historical = await getHistoricalData();
  console.log(historical.slice(-3));
  const future = await getFutureGames();
  console.log(future.slice(-3));
  await writeHistoricalData(historical);
  await writeFutureFixtures(future);
};

populateDB()
  .then(console.log("success"))
  .catch(e => console.error(e.message));
