import express from "express";
import pool from "../db.js";

const router = express.Router();

// 📌 Obtener todos los clientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY id_client ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes", detalle: error.detail || error.message });
  }
});

// 📌 Obtener un cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients WHERE id_client = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener cliente", detalle: error.detail || error.message });
  }
});

// 📌 Crear cliente
router.post("/", async (req, res) => {
  try {
    const { identity_number, name_client, address, email, phone } = req.body;
    const result = await pool.query(
      `INSERT INTO clients (identity_number, name_client, address, email, phone) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [identity_number, name_client, address, email, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear cliente", detalle: error.detail || error.message });
  }
});

// 📌 Actualizar cliente
router.put("/:id", async (req, res) => {
  try {
    const { identity_number, name_client, address, email, phone } = req.body;
    const result = await pool.query(
      `UPDATE clients
       SET identity_number = $1,
           name_client = $2,
           address = $3,
           email = $4,
           phone = $5
       WHERE id_client = $6
       RETURNING *`,
      [identity_number, name_client, address, email, phone, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar cliente", detalle: error.detail || error.message });
  }
});

// 📌 Eliminar cliente
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM clients WHERE id_client = $1 RETURNING *", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar cliente", detalle: error.detail || error.message });
  }
});

export default router;
