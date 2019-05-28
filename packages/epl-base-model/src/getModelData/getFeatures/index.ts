// one hot encoding of the team names means that
// Arsenal would be something like [1,0,0,0,...0]
export interface Features {
  homeTeam: number[];
  awayTeam: number[];
};

const flattenFeatures =  (rawFeatures: Features[]): number[][][] => {
  const flattenPropsToArray = <T>(o: T[]): number[][][] => o.reduce((a, c): number[][] => {
    return [...a, [...Object.values(c)]];
  }, []);
  const featureArray: number[][][]= flattenPropsToArray(rawFeatures);
  return featureArray;
};

export { flattenFeatures as default }
