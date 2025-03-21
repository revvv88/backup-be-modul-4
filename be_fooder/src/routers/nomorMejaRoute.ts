import express from "express";
import { getAllMeja, createMeja, updateMeja, deleteMeja } from "../controllers/nomorMejaController";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(`/`, [verifyToken, verifyRole(["CASHIER", "MANAGER"])], getAllMeja);
app.post(`/`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], createMeja);
app.put(`/:id`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], updateMeja);
app.delete(`/:id`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], deleteMeja);

export default app;
