const cluster = require("node:cluster");
const express = require("express");
const numCPUs = require("node:os").availableParallelism();
const process = require("node:process");
// const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const PORT = 3000;
  const app = express();
  app.get("/", (req, res) => {
    return res.json({
      message: `Hello from Server ${process.pid} `,
    });
  });
  app.listen(PORT, () => console.log(`Sever Started At PORT: ${PORT}`));
}
// console.log(numCPUs);
