import http from "http";
import express from "express";

const expr = express();
const server = http.createServer(expr);

expr.get("/", (req, res) => {
  console.log(req.ip);

  res.status(200).json({
    message: "Hello World!",
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
