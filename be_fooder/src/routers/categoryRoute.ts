import express from "express"
import { getAllCategory, createCategory, updateCategory, deleteCategory, TotalItems } from "../controllers/categoryController"
import { verifyAddCategory, verifyEditCategory } from "../middlewares/categoryValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"
import uploadFile from "../middlewares/menuUpload"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllCategory)
app.get(`/items`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], TotalItems)
app.post(`/`, [verifyToken, verifyRole(["MANAGER", "CASHIER"]),  verifyAddCategory], createCategory)
app.put(`/:id`, [verifyToken, verifyRole(["MANAGER", "CASHIER"]),  verifyEditCategory], updateCategory )
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER", "CASHIER"])], deleteCategory)

export default app