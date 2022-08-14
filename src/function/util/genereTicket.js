import axios from "axios"

export const GeneraTicket = async (data) => {
    try {
        let numero_control = data.numero_control
        let ticket =`COMNET (COMPUTECNICSNET S.A)\n RUC 092782129001\nFECHA: ${data.fecha}\n*---------------------------------------*\n*DESCRIPCION*\n*--------------------------------------*\nDESCUENTO: $0.00\nTOTAL: ${data.total}\nSALDO: $0.0\n*CLIENTE*\nNOMBRE:${data.cliente}\nDIRECCION:${data.direccion}\nCEDULA:${data.cedula}\nFECHA CORTE:${data.fecha_corte}\n*---------------------------------------*\nNUMERO CONTROL:${data.numero_control}\n}`
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
    let ticket =`COMNET (COMPUTECNICSNET S.A)\n RUC 092782129001\nFECHA: ${data.fecha}\n*---------------------------------------*\n*DESCRIPCION*\n*--------------------------------------*\nDESCUENTO: $0.00\nTOTAL: ${data.total}\nSALDO: $0.0\n*CLIENTE*\nNOMBRE:${data.cliente}\nDIRECCION:${data.direccion}\nCEDULA:${data.cedula}\nFECHA CORTE:${data.fecha_corte}\n*---------------------------------------*\nNUMERO CONTROL:${data.numero_control}\n}`
    return ticket
}