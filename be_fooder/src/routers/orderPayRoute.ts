import express from "express"
import { getAllPayOrder, createPayOrder, updatePayOrder, deletePayOrder, updateByOrderId } from "../controllers/paymentOrder"
import { verifyAddPayOrder, verifyEditPayOrder } from "../middlewares/payOrderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllPayOrder)
app.post(`/`, [verifyToken, verifyRole(["CASHIER","MANAGER"]), verifyAddPayOrder], createPayOrder)
app.put(`/:id`, [verifyToken, verifyRole(["CASHIER","MANAGER"]), verifyEditPayOrder], updatePayOrder )
app.put(`/updateByOrderId/:id`, [verifyToken, verifyRole(["CASHIER","MANAGER"]), verifyEditPayOrder], updateByOrderId )
app.delete(`/:id`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], deletePayOrder)

export default app