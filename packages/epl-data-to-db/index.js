const reader = require("@gvhinks/epl-data-reader");
const db = require("./dist/index");
const { getFixtures, default: getHistoricalData} = reader;
const { writeFutureFixtures, default: writeHistoricalData, updateFeatures } = db;


// TODO seasons not quite correct
/*
{
  "_id" : 8,
  "firstGame" : ISODate("2008-09-16T04:00:00.000Z"),
  "lastGame" : ISODate("2009-08-16T00:00:00.000Z"),
  "total" : 781.0
}

{
  "_id" : 9,
  "firstGame" : ISODate("2009-08-18T00:00:00.000Z"),
  "lastGame" : ISODate("2010-05-09T00:00:00.000Z"),
  "total" : 741.0
}

{
  "_id" : 18,
  "firstGame" : ISODate("2018-08-10T00:00:00.000Z"),
  "lastGame" : ISODate("2019-03-03T00:00:00.000Z"),
  "total" : 579.0
}
 */
// TODO Documuent kaggle seasons data
console.log("starting db import from static data files");

const populateDB = async () => {
  const historical = await getHistoricalData();
  console.log(historical.slice(-3));
  const future = await getFixtures();
  console.log(future.slice(-3));
  await writeHistoricalData(historical);
  await writeFutureFixtures(future);
  await updateFeatures();
};

populateDB()
  .then(console.log("success"))
  .catch(e => console.error(e.message));
