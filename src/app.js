import express from "express";
import dotenv from "dotenv";
import clientsRoutes from "./routes/clients.js";
import importRoutes from "./routes/import.js";
import reportsRoutes from "./routes/reports.js"; 

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Rutas API
app.use("/api/clients", clientsRoutes);
app.use("/api/import", importRoutes);
app.use("/api/reports", reportsRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
