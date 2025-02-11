import { Router } from "express";
import { saveAppointment, listUser, updateAppointmentUser, cancelledAppointmentUser} from "./appointment.controller.js";
import { createAppointmentValidator, listUserAppoiment, validatorCancelAppointment, validatorUpdateAppointment} from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);

router.get( "/userAppointment/:uid", listUserAppoiment, listUser);

router.patch("/updateAppointment/:uid", validatorUpdateAppointment, updateAppointmentUser)

router.delete("/cancelledAppointment/:uid", validatorCancelAppointment, cancelledAppointmentUser)

export default router;