import express from "express";
import pool from "../db.js";

const router = express.Router();

// 1) Total pagado por cliente
router.get("/total-paid-by-client", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id_client,
        c.identity_number,
        c.name_client, 
        COALESCE(SUM(CASE WHEN t.status = 'Completada' THEN t.amount_transaction ELSE 0 END), 0) AS total_paid
      FROM clients c
      LEFT JOIN invoices i ON c.id_client = i.id_client
      LEFT JOIN transactions t ON i.number_invoice = t.number_invoice
      GROUP BY c.id_client, c.identity_number, c.name_client
      ORDER BY total_paid DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2) Facturas pendientes con última transacción
router.get("/pending-invoices", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.number_invoice,
        i.period_invoice,
        i.amount_invoices,
        i.amount_paid,
        c.id_client,
        c.name_client,
        (
          SELECT t.id_transaction
          FROM transactions t
          WHERE t.number_invoice = i.number_invoice
          ORDER BY t.date_time DESC
          LIMIT 1
        ) AS last_transaction_id,
        (
          SELECT t.date_time
          FROM transactions t
          WHERE t.number_invoice = i.number_invoice
          ORDER BY t.date_time DESC
          LIMIT 1
        ) AS last_transaction_date,
        (
          SELECT t.status
          FROM transactions t
          WHERE t.number_invoice = i.number_invoice
          ORDER BY t.date_time DESC
          LIMIT 1
        ) AS last_transaction_status
      FROM invoices i
      JOIN clients c ON i.id_client = c.id_client
      WHERE i.amount_paid < i.amount_invoices
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3) Transacciones por plataforma (por nombre o id)
router.get("/transactions-by-platform", async (req, res) => {
  try {
    const { platform, id_platform } = req.query;
    let sql = `
      SELECT 
        p.id_platform,
        p.name_platform, 
        t.id_transaction, 
        t.date_time,
        t.amount_transaction,
        t.status,
        t.type_t
      FROM platforms p
      JOIN transactions t ON p.id_platform = t.id_platform
    `;
    const params = [];

    if (platform) {
      sql += ` WHERE p.name_platform ILIKE $1 ORDER BY t.date_time DESC`;
      params.push(platform);
    } else if (id_platform) {
      sql += ` WHERE p.id_platform = $1 ORDER BY t.date_time DESC`;
      params.push(id_platform);
    } else {
      sql += ` ORDER BY t.date_time DESC`;
    }

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
