import * as fastify from "fastify";
import * as fastifyCors from "fastify-cors";
import { modelHandler } from "./model";
import { weightsHandler } from "./weights";
import { fixtureHandler } from "./fixtures";

const app = fastify({logger: true});

app.register(fastifyCors, {
  origin: /.*localhost.*/
});

console.log(Array(100).join("="));
console.log("       started ...");
console.log(Array(100).join("="));


app.get("/model.json", modelHandler);
app.get("/weights.bin", weightsHandler);
app.get("/fixtures", fixtureHandler)

app.listen(3000, (err, address): void => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)
});
