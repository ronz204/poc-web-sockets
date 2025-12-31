import express from "express";

const expr = express();

expr.get("/", (req, res) => {
  console.log(req.ip);

  res.status(200).json({
    message: "Hello World!",
  });
});

expr.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
