import {pool} from '../db/index.js';

export const ping = async (req, res)=>{
    try {
      const [result] = await pool.query("SELECT 'Pong' AS result");
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ message: "An error has ocurred!" });
    }
    
};