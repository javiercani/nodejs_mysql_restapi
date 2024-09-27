import { pool } from "../db/index.js";
import request from "request";
import http from "https";

export const newEmail = async (req, res) => {
  try {
    const { email_to, cc, subject, body, schedule, sys_email_config_id } = req.body;
    const [rows] = await pool.query(
      "insert into sys_email(email_to, cc, subject, body, schedule, sys_email_config_id) values (?, ?, ?, ?, ?, ?)",
      [email_to, cc, subject, body, schedule, sys_email_config_id]
    );
    console.log(rows);
    
    if (rows.insertId <= 0) {
      res.status(404).json({ message: "Email not inserted" });
    } else {
      sendMailById(rows.insertId, (status, data) => {
            console.log(status,data);
            
            if(status) {
                res.sendStatus(204)
            } else {
                res.status(500).json(data);
            }
            }
        );
    }
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
};

export const sendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    sendMailById(id, (status, data) => {
        console.log(status, data);
        
        if (status) {
            res.sendStatus(204);
        } else {
            res.status(500).json(data);
        }}
    );
  } catch (error) {
    res.status(500).json({ message: "An error has ocurred!" });
  }
};

export const sendMailById = async (id, callback) => {
    console.log("SendMailById: ", id);
    
    const [rows] = await pool.query(
      "SELECT * FROM sys_email e LEFT JOIN sys_email_config c ON e.sys_email_config_id=c.id WHERE e.id=?",
      [id]
    );
    if (rows.length <= 0) {
      callback(false,{ message: "Mail not found" });
    } else {
      console.log(rows[0]);
      let statusE = "N";

      var options = {
        method: "POST",
        hostname: "astratto.ipzmarketing.com",
        port: null,
        path: "/api/v1/send_emails",
        headers: {
          "content-type": "application/json",
          "x-auth-token": "jy7yBgoJtKdjF6mueRe_ZLnPryVePWj3GTqyJi88",
        },
      };

      var request = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", async function () {
            let body = Buffer.concat(chunks);
            console.log(body.toString());
            if (JSON.parse(body.toString()).errors) {
              statusE = "E";
              console.log("Con error");

              await pool.query(
                "update sys_email set sent=? where id=?",
                [statusE, id]
              );
              callback(false, { message: "Mail not sent" });
            } else {
              console.log("Sin Errores");
              statusE = "Y";
              await pool.query(
                "update sys_email set sent=? where id=?",
                [statusE, id]
              );
              callback(true, { message: "Mail sent" });
            }
        });

        res.on("error", async ()=>{
            let body = Buffer.concat(chunks);
            console.log(body.toString());
            console.log("Con error");
            statusE = "E";
            await pool.query(
              "update sys_email set sent=? where id=?",
              [statusE, id]
            );
            callback(false, { message: "Mail not sent" });
        });
      });

      request.write(
        JSON.stringify({
          from: {
            email: rows[0].email_from,
            name: rows[0].name,
          },
          to: [
            {
              email: rows[0].email_to,
            },
          ],
          subject: rows[0].subject,
          html_part: rows[0].body,
          //   text_part: "My text content.",
          text_part_auto: true,
          //   headers: { "X-CustomHeader": "Header value" },
          smtp_tags: ["string"],
        })
      );
      request.end();
    }
};
