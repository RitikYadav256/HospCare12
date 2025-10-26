import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import data from "./routes/treatment.route.js";
import connectDB from "./utils/lib.js";
import { valid } from "./controller/auth.controller.js";
import Medical from "./routes/Medical.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors());
app.use("/api", data);
app.use("/api/Medical", Medical);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the HospCare API!");
});

app.listen(PORT, async () => {

  const resp343 = await connectDB(); 
  if (!resp343) {
    console.error("Failed to connect to the database. Exiting..."+resp343);
    process.exit(1); 
  }
  console.log(`Server is running on http://localhost:${PORT}`);
  
});
