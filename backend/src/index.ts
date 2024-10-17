import express from "express";
import z from "zod";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    Message: "Server is running ",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
