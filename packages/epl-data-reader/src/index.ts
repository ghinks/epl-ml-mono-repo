import { findDataFiles, readMatchResult } from "./findFiles";
import { MatchResult} from "./matchResult";
import "core-js/fn/array/flat-map";

const findMatchesInPath = async (dataPath: string): Promise<MatchResult[]> => {
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
    const matches = matcheArrs.flatMap(a => a);
    console.log(matches);
    return matches;

  } catch (e) {
    console.error(e.message);
  }
};

export default findMatchesInPath;
export { MatchResult } from "./matchResult"
