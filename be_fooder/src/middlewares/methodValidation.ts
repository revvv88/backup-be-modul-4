import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema when add new menu's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    nama: Joi.string().required(),
    tipe: Joi.string().valid('CASH','VIRTUAL','DEBIT').uppercase().required(),
    logo: Joi.allow().optional(),
})

/** create schema when edit new menu's data, all of fileds have to be required */
const editDataSchema = Joi.object({
    nama: Joi.string().optional(),
    tipe: Joi.string().valid('CASH','VIRTUAL','DEBIT').uppercase().optional(),
    logo: Joi.allow().optional(),
})


export const verifyAddMethod = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditMethod = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = editDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}