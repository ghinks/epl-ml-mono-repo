export interface Labels {
  homeWin: number;
  awayWin: number;
  draw: number;
  seasonNumber: number;
}

// this is a property to array transformation
// that allows one hot encoding on the props
// to be flattened to an array
const flattenLabels = (rawLabels: Labels[]): number[][] => {
  const flattenPropsToArray = <T>(o: T[]): number[][] => o.reduce((a, c): number[] => {
    return [...a, [...Object.values(c)]];
  }, []);
  const labelsArray: number[][]= flattenPropsToArray(rawLabels);
  return labelsArray;
};

export { flattenLabels as default }
