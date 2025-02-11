import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { parse } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        msg: "No se encontró la mascota" 
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      msg: "Error al crear la cita", 
      error 
    }); 
  }
};

export const listUser = async (req, res) => {
  const { uid } = req.params
  try{
      const user = await User.findById(uid)

      if(!user){
        return res.status(404).json({
            success: false,
            message: "Usuario no tiene citas"
        })
      }
      const query = { user: user }
      const [total, users ] = await Promise.all([
        Appointment.countDocuments(query),
        Appointment.find(query)
      ])

      return res.status(200).json({
        success: true,
        total,
        users
    })
  }catch(err){
      return res.status(500).json({
          message: "login failed, server error",
          error: err.message
      })
  }
}

export const updateAppointmentUser = async(req, res) => {
  try{
    const { uid } = req.params
    const { date } = req.body

    const appointmentObject = await Appointment.findByIdAndUpdate(uid, { date: date }, { new: true });

    return res.status(200).json({
      suceess: true,
      message: "Fecha actualizada",
      appointmentObject
    })

  }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la cita",
            error: err.message
        })
    }
}

export const cancelledAppointmentUser = async (req, res) =>{
  try{
      const {uid} = req.params
      
      const appointmentObject = await Appointment.findByIdAndUpdate(uid, {status: "CANCELLED" }, {new: true})
      
      return res.status(200).json({
          sucess: true,
          message: "Cita Cancelada",
          appointmentObject
      })
  }catch(err){
      return res.status(500).json({
          success: false,
          message: "Error al cancelar la cita",
          error: err.message
      })
  }
}