import { FixturePrediction, Forecast } from "@gvhinks/epl-common-interfaces";

interface Update {
  win: number;
  lose: number;
  draw: number;
  points: number;
};

const getHomeTeamPoints = (fxPrd: FixturePrediction): number => {
  if (fxPrd.standardizedResult[0]) return 3;
  else if (fxPrd.standardizedResult[1]) return 0;
  return 1;
};

const getAwayTeamPoints = (fxPrd: FixturePrediction): number => {
  if (fxPrd.standardizedResult[1]) return 3;
  else if (fxPrd.standardizedResult[0]) return 0;
  return 1;
};

function createNewHomeTeamEntry(singeGamePrediction, forecastTable: Map<string, Forecast>): void {
  const forecast: Forecast = {
    position: 0,
    team: singeGamePrediction.homeTeam,
    wins: singeGamePrediction.standardizedResult[0],
    loses: singeGamePrediction.standardizedResult[1],
    draws: singeGamePrediction.standardizedResult[2],
    points: getHomeTeamPoints(singeGamePrediction)
  };
  // console.log(`create home team forecast ${JSON.stringify(forecast)}`)
  forecastTable.set(singeGamePrediction.homeTeam, forecast);
}

function createNewAwayTeamEntry(singeGamePrediction, forecastTable: Map<string, Forecast>): void {
  const forecast: Forecast = {
    position: 0,
    team: singeGamePrediction.awayTeam,
    wins: singeGamePrediction.standardizedResult[1],
    loses: singeGamePrediction.standardizedResult[0],
    draws: singeGamePrediction.standardizedResult[2],
    points: getAwayTeamPoints(singeGamePrediction)
  };
  // console.log(`create away team forecast ${JSON.stringify(forecast)}`)
  forecastTable.set(singeGamePrediction.awayTeam, forecast);
}

function updateHomeTeamTblEntry(leageTblMp: Map<string, Forecast >, fixturePrediction, homeTeamUpdate: Update): void {
  const homeTeamForecast: Forecast = leageTblMp.get(fixturePrediction.homeTeam);
  homeTeamForecast.wins += homeTeamUpdate.win;
  homeTeamForecast.loses += homeTeamUpdate.lose;
  homeTeamForecast.draws += homeTeamUpdate.draw;
  homeTeamForecast.points += homeTeamUpdate.points;
  // console.log(`update home team forecast ${JSON.stringify(leageTblMp.get(fixturePrediction.homeTeam))}`)
}

function updateAwayTeamTblEntry(leageTblMp: Map<string, Forecast>, fixturePrediction, awayTeamUpdate: Update): vqid {
  const awayTeamForecast: Forecast = leageTblMp.get(fixturePrediction.awayTeam);
  awayTeamForecast.wins += awayTeamUpdate.win;
  awayTeamForecast.loses += awayTeamUpdate.lose;
  awayTeamForecast.draws += awayTeamUpdate.draw;
  awayTeamForecast.points += awayTeamUpdate.points;
  // console.log(`update home team forecast ${JSON.stringify(leageTblMp.get(fixturePrediction.awayTeam))}`)
}

const collateTable = (results: FixturePrediction[]): Forecast[] => {
  const tableMap: Map<string, Forecast> = results.reduce((leageTblMp: Map<string, Forecast>, fixturePrediction: FixturePrediction): Map<string, Forecast> => {

    // cases
    // home , away
    // home , !away
    // !home, away
    // !home, !away
    const homeTeamUpdate: Update = {
      win: fixturePrediction.standardizedResult[0],
      lose: fixturePrediction.standardizedResult[1],
      draw: fixturePrediction.standardizedResult[2],
      points: getHomeTeamPoints(fixturePrediction)
    };

    const awayTeamUpdate: Update = {
      win: fixturePrediction.standardizedResult[1],
      lose: fixturePrediction.standardizedResult[0],
      draw: fixturePrediction.standardizedResult[2],
      points: getAwayTeamPoints(fixturePrediction)
    };

    // console.log(`${fixturePrediction.homeTeam}/${fixturePrediction.awayTeam} ${JSON.stringify(homeTeamUpdate)} ${JSON.stringify(awayTeamUpdate)}`);

    if (leageTblMp.has(fixturePrediction.homeTeam) && leageTblMp.has(fixturePrediction.awayTeam)) {
      // console.log("h/a");
      updateHomeTeamTblEntry(leageTblMp, fixturePrediction, homeTeamUpdate);
      updateAwayTeamTblEntry(leageTblMp, fixturePrediction, awayTeamUpdate);
    } else if (leageTblMp.has(fixturePrediction.homeTeam) && !leageTblMp.has(fixturePrediction.awayTeam)) {
      // console.log("h/!a")
      updateHomeTeamTblEntry(leageTblMp, fixturePrediction, homeTeamUpdate);
      createNewAwayTeamEntry(fixturePrediction, leageTblMp);
    } else if (!leageTblMp.has(fixturePrediction.homeTeam) && leageTblMp.has(fixturePrediction.awayTeam)) {
      // console.log("!h/a")
      updateAwayTeamTblEntry(leageTblMp, fixturePrediction, awayTeamUpdate);
      createNewHomeTeamEntry(fixturePrediction, leageTblMp);
    } else {
      // console.log("!h/!a")
      createNewHomeTeamEntry(fixturePrediction, leageTblMp);
      createNewAwayTeamEntry(fixturePrediction, leageTblMp);
    }
    return leageTblMp;
  }, new Map<string, Forecast>());

  //list.sort((a, b) => (a.color > b.color) ? 1 : -1)
  let tbl = Array.from(tableMap.values()).sort((a: Forecast, b: Forecast): number => (a.points > b.points) ? -1 : 1);
  tbl = tbl.map((f: Forecast, i: number): Forecast => {
    f.position = i + 1;
    return f;
  })
  return tbl;
};

export { collateTable }
