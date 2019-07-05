import { findDataFiles, readMatchResult } from "./findJsonFiles";
import { MatchResult} from "./matchResult";
import { StandardResult } from "./standardResult";
import * as csv from "csvtojson"
import "core-js/fn/array/flat-map";

const getJSONTenYearData = async (dataPath = `${__dirname}/../data/historicalData`): Promise<StandardResult[]> => {
  console.log(__dirname);
  try {
    let files: string[] = await findDataFiles(dataPath);
    files = files.reduce((accum, curr): string[] => {
      if (curr.match(/.*json/)) {
        accum.push(`${dataPath}/${curr}`);
      }
      return accum;
    }, [])
    // yes an array of promises of arrays of match results
    const dataProms: Promise<MatchResult[]>[] = files.map((f): Promise<MatchResult[]> => readMatchResult(f));
    const matcheArrs: MatchResult[][] = await Promise.all([...dataProms]);
    const matches: MatchResult[] = matcheArrs.flatMap(<T> (a: T): T => a);
    const standardMatches: StandardResult[] = matches.map((m: MatchResult): StandardResult => ({
      Date: new Date(m.Date),
      HomeTeam: m.HomeTeam,
      AwayTeam: m.AwayTeam,
      Referee: m.Referee
    }));
    return standardMatches;

  } catch (e) {
    console.error(e.message);
  }
};

const getCsvData = async (maxDate: Date, fileName = `${__dirname}/../data/eplCSV2000-2018/data.csv`): Promise<StandardResult[]> => {
  const jsonData = await csv().fromFile(fileName);
  const standardMatches: StandardResult[] = jsonData.reduce((a: StandardResult[], v: object, i: number): StandardResult[] => {
    const regex = /(\d+)\/(\d+)\/(\d+)/;
    // @ts-ignore
    const match = v.Date.match(regex);
    if (match === null) {
      console.error(i);
      console.error(v);
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);
    year = year < 2000 ? year + 2000 : year;
    const matchDate = new Date(year, month, day);

    if (matchDate > maxDate ) {
      return a;
    }

    const result: StandardResult = {
      Date: matchDate,
      // @ts-ignore
      HomeTeam: v.HomeTeam,
      // @ts-ignore
      AwayTeam: v.AwayTeam,
      // @ts-ignore
      Referee: v.Referee
    };
    return [...a, result];
  }, []);
  return standardMatches;
};

// merge of the 2 data sets
const getHistoricalData = async (): Promise<StandardResult[]> => {
  const dataTo2019: StandardResult[] = await getJSONTenYearData();
  const minDate = dataTo2019.reduce((a: Date, c: StandardResult): Date => {
    if (c.Date < a) return c.Date;
    return a;
  }, new Date());
  const dataToMinDate: StandardResult[] = await getCsvData(minDate);
  return [...dataToMinDate, ...dataTo2019]
};

export { getHistoricalData as default, MatchResult, StandardResult, getJSONTenYearData, getCsvData }
