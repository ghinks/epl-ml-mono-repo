import * as fastify from "fastify";
import { promises as fspromises } from "fs";
import * as path from "path";

const app = fastify({logger: true});

const readModelJson = async (): Promise<string> => {
  const fileName = "model.json";
  const filePath = path.resolve(path.join(__dirname, "../model"), fileName);
  console.log(filePath);
  const data = await fspromises.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

app.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  const data = await readModelJson();
  return data;
})

app.listen(3000, (err, address) => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)
})
