import { pool } from "../db/index.js";

export const newContact = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    const [rows] = await pool.query("insert into contact(name, phone, email, message) values (?,?,?,?)",[name, phone, email, message]);
    res.send({ id: rows.insertId, name, phone, email, message });
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
};