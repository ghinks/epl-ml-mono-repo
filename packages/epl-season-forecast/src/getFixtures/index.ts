import { Fixture } from "@gvhinks/epl-common-interfaces";
import "isomorphic-fetch";
import { fixturesUrl } from "../../../epl-constants";

const getFixtures = async (): Promise<Fixture[]> => {
  const conn = await fetch(fixturesUrl.host + fixturesUrl.uri);
  const results: Fixture[] = await conn.json();
  return results;
};

export { getFixtures }
