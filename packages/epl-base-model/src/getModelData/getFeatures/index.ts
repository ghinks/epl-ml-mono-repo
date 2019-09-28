// one hot encoding of the team names means that
// Arsenal would be something like [1,0,0,0,...0]
export interface Features {
  homeTeam: number[];
  awayTeam: number[];
  seasonNumber: number;
};

// The values of the tensor. Can be nested array of numbers, or a flat array, or a TypedArray.
const flattenFeatures =  (rawFeatures: Features[]): number[] => {
  const featureArray: number[] = rawFeatures.reduce((a: number[], c: Features): number[] => {
    return [...a, ...c.homeTeam, ...c.awayTeam, c.seasonNumber];
  }, []);
  return featureArray;
};

export { flattenFeatures as default }
