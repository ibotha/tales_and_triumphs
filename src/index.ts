import express from "express";

const app = express();

const port = 3000;

app.use("/static", express.static("static"));

app.get("*", (req, res) => {
  res.sendFile(process.cwd() + "/static/index.html");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
