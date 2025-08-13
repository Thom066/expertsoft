import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import pool from "../db.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Detecta tabla según columnas
const tableMapping = {
  clients: ["id_client", "identity_number", "name_client", "address", "email", "phone"],
  platforms: ["id_platform", "name_platform"],
  invoices: ["number_invoice", "period_invoice", "amount_invoices", "amount_paid", "id_client"],
  transactions: ["id_transaction", "date_time", "amount_transaction", "status", "type_t", "id_platform", "number_invoice"]
};

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no se envio el archivo" });

  const rows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      try {
        const columns = Object.keys(rows[0]).map(c => c.trim());
        const tableName = Object.keys(tableMapping).find(table =>
          JSON.stringify(tableMapping[table]) === JSON.stringify(columns)
        );

        if (!tableName) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "no coinciden las tablas" });
        }

        for (const row of rows) {
          const values = tableMapping[tableName].map(col => row[col]);
          const placeholders = values.map((_, i) => `$${i + 1}`).join(",");
          await pool.query(
            `INSERT INTO ${tableName} (${tableMapping[tableName].join(",")}) VALUES (${placeholders})
             ON CONFLICT DO NOTHING`,
            values
          );
        }

        fs.unlinkSync(req.file.path);
        res.json({ message: `csv se importo a la tabla ${tableName}`, count: rows.length });
      } catch (error) {
       console.error("Error al insertar:", error);
        res.status(500).json({ error: "Error al importar CSV", detalle: error.message });

      }
    });
});

export default router;
