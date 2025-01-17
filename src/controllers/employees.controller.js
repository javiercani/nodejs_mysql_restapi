import { pool } from "../db/index.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM employee WHERE id=?", [id]);

    if (rows.length <= 0) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      res.json(rows);
    }
  } catch (error) {
    res.status(500).json({message: "An error has ocurred!"})
  }
  
};

export const putEmployees = async (req, res) => {

  try {
    const { id } = req.params;
    const { name, salary } = req.body;

    const [result] = await pool.query(
      "UPDATE employee SET name=IFNULL(?,name), salary=IFNULL(?,salary) WHERE id=?",
      [name, salary, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      const [rows] = await pool.query("SELECT * FROM employee WHERE id=?", [
        id,
      ]);
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
  
};

export const postEmployees = async (req, res) => {
  try {
    const { name, salary } = req.body;

    const [rows] = await pool.query(
      "INSERT INTO employee (name, salary) VALUES (?,?)",
      [name, salary]
    );
    res.send({ id: rows.insertId, name, salary });
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
  
};

export const delEmployees = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM employee WHERE id=?", [id]);

    if (result.affectedRows <= 0) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
  
};
