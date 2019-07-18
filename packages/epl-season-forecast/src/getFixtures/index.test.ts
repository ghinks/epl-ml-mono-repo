import { getFixtures } from "./index";
import { Fixture } from "@gvhinks/epl-common-interfaces";
import * as nock from "nock";
import { fixturesUrl } from "../../../epl-constants";

describe("forecast", (): void => {
  const testResponse: Fixture[] = [
    {
      roundNumber: 1,
      date: new Date(),
      homeTeam: "teamA",
      awayTeam: "teamB",
      location: "teamA Stadium"
    },
    {
      roundNumber: 1,
      date: new Date(),
      homeTeam: "teamC",
      awayTeam: "teamD",
      location: "teamD Stadium"
    }
  ];
  let scope;
  beforeAll(() => {
    scope = nock(fixturesUrl.host)
      .get(fixturesUrl.uri)
      .reply(200, testResponse);
  });
  afterAll(() => {
    nock.cleanAll();
  });
  test("expect to get fixtures", async (): Promise<void> => {
    const results = await getFixtures();
    expect(results.length).toEqual(2);
    expect(scope.isDone()).toBeTruthy();
  });
});
