import express from "express"
import { getAllMethod, createMethod, updateMethod, deleteMethod, getByType } from "../controllers/paymentMethodController"
import { verifyAddMethod, verifyEditMethod } from "../middlewares/methodValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"
import uploadFile from "../middlewares/menuUpload"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllMethod)
app.get(`/tipe`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getByType)
app.post(`/`, [verifyToken, verifyRole(["MANAGER", "CASHIER"]), uploadFile.single("logo"), verifyAddMethod], createMethod)
app.put(`/:id`, [verifyToken, verifyRole(["MANAGER", "CASHIER"]), uploadFile.single("logo"), verifyEditMethod], updateMethod )
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER", "CASHIER"])], deleteMethod)

export default app