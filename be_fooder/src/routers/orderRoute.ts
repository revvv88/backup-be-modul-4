import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder, getOrderById, getAllHistory, getHistoryById, updateStatusById } from "../controllers/orderController"
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllOrders)
app.get(`/history`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllHistory)
app.get(`/history/:id`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getHistoryById)
app.post(`/`, [verifyToken, verifyRole(["CASHIER"]), verifyAddOrder], createOrder)
app.put(`/:id`, [verifyToken, verifyRole(["CASHIER"])], updateStatusById)
app.get(`/:id`, [verifyToken, verifyRole(["CASHIER"])], getOrderById)
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteOrder)

export default app