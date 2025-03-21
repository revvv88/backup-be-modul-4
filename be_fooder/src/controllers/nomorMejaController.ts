import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

/** ✅ Get All Meja */
export const getAllMeja = async (request: Request, response: Response) => {
  try {
    const allMeja = await prisma.nomormeja.findMany();
    return response.status(200).json({
      status: true,
      data: allMeja,
      message: `Nomor Meja has been retrieved`,
    });
  } catch (error) {
    return response.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

/** ✅ Create Meja */
export const createMeja = async (request: Request, response: Response) => {
  try {
    const { nomor } = request.body;
    if(!nomor){
        return response.status(400).json({
            status: false,
            message: "Masukkan Nomor Meja.",
          });
    }

    // Cek apakah nomor sudah ada
    const existingMeja = await prisma.nomormeja.findUnique({ where: { nomor } });
    if (existingMeja) {
      return response.status(400).json({
        status: false,
        message: "Nomor meja sudah ada.",
      });
    }

    const newMeja = await prisma.nomormeja.create({
      data: { nomor },
    });

    return response.status(201).json({
      status: true,
      data: newMeja,
      message: `New Nomor Meja has been created`,
    });
  } catch (error) {
    return response.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

/** ✅ Update Meja */
export const updateMeja = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { nomor } = request.body;

    const findMeja = await prisma.nomormeja.findUnique({ where: { id: Number(id) } });
    if (!findMeja) {
      return response.status(404).json({
        status: false,
        message: `Nomor Meja not found`,
      });
    }

    const updatedMeja = await prisma.nomormeja.update({
      where: { id: Number(id) },
      data: { nomor },
    });

    return response.status(200).json({
      status: true,
      data: updatedMeja,
      message: `Nomor Meja has been updated`,
    });
  } catch (error) {
    return response.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

/** ✅ Delete Meja */
export const deleteMeja = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const findMeja = await prisma.nomormeja.findUnique({ where: { id: Number(id) } });
    if (!findMeja) {
      return response.status(404).json({
        status: false,
        message: `Nomor Meja not found`,
      });
    }

    await prisma.nomormeja.delete({ where: { id: Number(id) } });

    return response.status(200).json({
      status: true,
      message: `Nomor Meja has been deleted`,
    });
  } catch (error) {
    return response.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};
