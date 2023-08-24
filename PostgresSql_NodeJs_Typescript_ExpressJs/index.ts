import express from "express";
import pgPromise from "pg-promise";
require("dotenv").config();

const { DbAdminPass,DbName } = process.env;
const app = express();
const port = 3000;
const pgp = pgPromise();
const db = pgp(`postgres://postgres:${DbAdminPass}@localhost:5432/${DbName}`);

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const data = await db.any("SELECT * FROM employees");
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
