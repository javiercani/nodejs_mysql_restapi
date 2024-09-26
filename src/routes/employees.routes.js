import {Router} from "express"
import {getEmployees,postEmployees,putEmployees,delEmployees, getEmployee} from '../controllers/employees.controller.js'

const router = Router()

router.get("/employees", getEmployees);

router.get("/employees/:id", getEmployee);

router.post("/employees", postEmployees);

router.patch("/employees/:id", putEmployees);

router.delete("/employees/:id", delEmployees);

export default router
