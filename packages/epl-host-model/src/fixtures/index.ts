import { Fixture } from "@gvhinks/epl-data-reader";
import * as mongodb from "mongodb";
import {url, dbName, fixtures as fixturesCollection } from "@gvhinks/epl-constants";

const getCollection = (client: mongodb.MongoClient): mongodb.Collection =>
  client.db(dbName).collection(fixturesCollection);

const readFixtures = async (): Promise<Fixture[]> => {
  try {
    const client: mongodb.MongoClient = await mongodb.MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const collection = getCollection(client);
    const fixtures: Fixture[] = await collection.find({}).toArray();
    return fixtures;

  } catch (e) {
    console.error(e.message);
    return [];
  }
};

const fixtureHandler = async (request, reply): Promise<void> => {
  console.log(request.params);
  console.log(request.headers);
  const fixtures = await readFixtures();
  reply.type("application/json").code(200).send(fixtures);
};

export { readFixtures, fixtureHandler };
