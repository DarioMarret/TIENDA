import axios from "axios"
import { UtimoTicket } from "./global"

export const GeneraTicket = async (data) => {
    try {
        let numero_control = data.numero_control
        let ticket =`${data.empresa}\n COMPROBANTE DE PAGO\nFECHA: ${data.fecha}\n*---------------------------------------*\n*DESCRIPCION*\n*--------------------------------------*\nDESCUENTO: $0.00\nTOTAL: ${data.total}\nSALDO: $0.0\n*CLIENTE*\nNOMBRE:${data.cliente}\nDIRECCION:${data.direccion}\nCEDULA:${data.cedula}\nFECHA CORTE:${data.fecha_corte}\n*---------------------------------------*\nNUMERO CONTROL:${data.numero_control}\n\nDESCARGAR TU FACTURA: ${data.link}`
        localStorage.setItem(UtimoTicket, ticket)
        const response = await axios.put('https://rec.netbot.ec/v1/api/ticket', {
                "ticket":ticket,
                "numero_control":numero_control
            }, {
                headers: {
                    'Authorization': 'Basic YWRtaW46YWRtaW4=',
                    'Content-Type': 'application/json'
                }
            })
            console.log(response)
    } catch (error) {
        console.log(error)        
    }
}


export const Ticket = async (data) => {
    let ticket =`${data.empresa}\n COMPROBANTE DE PAGO\nFECHA: ${data.fecha}\n*---------------------------------------*\n*DESCRIPCION*\n*--------------------------------------*\nDESCUENTO: $0.00\nTOTAL: ${data.total}\nSALDO: $0.0\n*CLIENTE*\nNOMBRE:${data.cliente}\nDIRECCION:${data.direccion}\nCEDULA:${data.cedula}\nFECHA CORTE:${data.fecha_corte}\n*---------------------------------------*\nNUMERO CONTROL:${data.numero_control}\n\nDESCARGAR TU FACTURA: ${data.link}`
    return ticket
}