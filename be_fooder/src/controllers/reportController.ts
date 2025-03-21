import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getDashboard = async (request: Request, response: Response) => {
    try {
        /** process to get order, contains means search name or table number of customer's order based on sent keyword */
        const allUsers = await prisma.user.findMany()
        const allMenus = await prisma.menu.findMany()
        const newOrders = await prisma.order.findMany({
            where: {
                OR: [
                    { status: "NEW" },
                    { status: "PAID"}
                ]},
        })
        const doneOrders = await prisma.order.findMany({
            where: {status:  'DONE'},
        })
        return response.json({
            status: true,
            data: {
                allUser: allUsers.length,
                allMenus: allMenus.length,
                newOrder: newOrders.length,
                doneOrder: doneOrders.length,
            },
            message: `Order list has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const getFavourite = async (request: Request, response: Response) => {
    try {
        // Mengambil semua order list yang ada
        const orderLists = await prisma.orderlist.findMany({
            include: {
                menu: true, // Mengambil informasi menu
            },
        });

        // Membuat objek untuk menyimpan jumlah pemesanan per menu
        const menuCount: { [key: string]: number } = {};

        // Menghitung jumlah pemesanan untuk setiap menu
        orderLists.forEach(orderList => {
            const menuName = orderList.menu?.name; // Nama menu
            if (menuName) {
                if (!menuCount[menuName]) {
                    menuCount[menuName] = 0; // Inisialisasi jika belum ada
                }
                menuCount[menuName] += orderList.quantity; // Menambahkan jumlah pemesanan
            }
        });

        // Mengubah objek menjadi array untuk dikirim sebagai respons
        const result = Object.entries(menuCount).map(([name, count]) => ({
            name,
            count,
        }));

        return response.json({
            status: true,
            data: result,
            message: "All report menu are retrieved",
        }).status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}