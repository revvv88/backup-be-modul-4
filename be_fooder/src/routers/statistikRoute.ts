import express from "express"
import { getPesanan } from "../controllers/statistikController"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get(`/total-pesanan`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getPesanan)

export default app      