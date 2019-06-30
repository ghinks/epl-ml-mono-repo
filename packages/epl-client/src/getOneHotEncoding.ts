import teamsArray from "./teamNames";

const getOneHotEncoding = (teamName: string): number[] => {
  // @ts-ignore
  const oneHotEncoded: number[] = teamsArray.reduce((a, v): number[] => {
    if (v[0] === teamName) {
      // @ts-ignore
      return v[1];
    }
    // @ts-ignore
    return a;
  }, []);
  return oneHotEncoded;
};

export default getOneHotEncoding;
