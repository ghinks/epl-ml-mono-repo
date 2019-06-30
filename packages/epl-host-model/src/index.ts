import * as fastify from "fastify";
import { promises as fspromises } from "fs";
import * as path from "path";

const app = fastify({logger: true});

const readModelJson = async (): Promise<string> => {
  const fileName = "model.json";
  const filePath = path.resolve(path.join(__dirname, "../model"), fileName);
  console.log(filePath);
  const data = await fspromises.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const readWeights = async (): Promise<string> => {
  const fileName = "weights.bin";
  const filePath = path.resolve(path.join(__dirname, "../model"), fileName);
  console.log(filePath);
  const data = await fspromises.readFile(filePath, "binary");
  return data;
};

app.get("*", async (request, reply): Promise<void> => {
  console.log(request.params);
  console.log(request.headers);
  if (request.params["*"] === "/model.json") {
    const data = await readModelJson();
    reply.type("application/json").code(200).send(data);
  }
  else if (request.params["*"] === "/weights.bin"){
    const data = await readWeights();
    reply.type("application/bin").code(200).send(data);
  } else {
    const data = {
      params: request.params,
      message: "not handled"
    };
    reply.type("application/json").code(400).send(data);
  }
});

app.listen(3000, (err, address): void => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)
})
