import * as fastify from "fastify";
import { promises as fspromises } from "fs";
import * as path from "path";
import * as fastifyCors from "fastify-cors";

const app = fastify({logger: true});

app.register(fastifyCors, {
  origin: /.*localhost.*/
});

console.log(Array(100).join("="));
console.log("       started ...");
console.log(Array(100).join("="));

const readModelJson = async (): Promise<string> => {
  const fileName = "model.json";
  const filePath = path.resolve(path.join(__dirname, "../model"), fileName);
  console.log(filePath);
  const data = await fspromises.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const readWeights = async (): Promise<Buffer> => {
  const fileName = "weights.bin";
  const filePath = path.resolve(path.join(__dirname, "../model"), fileName);
  console.log(filePath);
  const data: Buffer = await fspromises.readFile(filePath);
  return data;
};

app.get("/model.json", async (request, reply): Promise<void> => {
  console.log(request.params);
  console.log(request.headers);
  const data = await readModelJson();
  reply.type("application/json").code(200).send(data);
});

app.get("/weights.bin", async (request, reply): Promise<void> => {
  console.log(request.params);
  console.log(request.headers);
  const data = await readWeights();
  reply.type("application/octet-stream").code(200).send(data);
});

app.listen(3000, (err, address): void => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)
})
