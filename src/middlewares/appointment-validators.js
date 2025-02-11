import { body, param } from "express-validator";
import { validarCampos, } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { userExists } from "../helpers/db-validators.js";
export const createAppointmentValidator = [
    body("date").notEmpty().withMessage("La fecha es requerida"),
    body("pet").notEmpty().withMessage("La mascota es requerida"),
    body("pet").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];


export const listUserAppoiment = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
];

export const validatorUpdateAppointment = [
    param("uid", "No es un ID válido").isMongoId(),
    validarCampos,
    handleErrors
];

export const validatorCancelAppointment = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];