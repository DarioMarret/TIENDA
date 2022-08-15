/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */


import { Alert, Box, Button, Card, CircularProgress, FormControl, FormGroup, Grid, Input, MenuItem, Modal, Select } from '@mui/material';
import axios from 'axios';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState, useRef, } from 'react';
import { useReactToPrint } from 'react-to-print';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { dataCliente, dataClienteGet, dataClienteId } from '../../function/localstore/storeUsuario';
import { Fecha } from '../../function/util/usuario';
import { blue } from '@mui/material/colors';
import { GeneraTicket } from 'function/util/genereTicket';
import { UtimoTicket } from 'function/util/global';
import Swal from 'sweetalert2'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid white',
    borderRadius: '5px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
}


function Pagar() {
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [resultaBusqueda, setResultaBusqueda] = useState(null);

    const [estadoPagar, setEstadoPagar] = useState(false);
    const [bloqueoPagar, setBloqueoPagar] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState(null);

    const [estadoTransaccion, setEstadoTransaccion] = useState(false);
    const [bloqueoTotal, setBloqueoTotal] = useState(false);
    const [saldoInsuficiente, setSaldoInsuficiente] = useState(false);
    const componentRef = useRef();

    const [dataPersona, setdataPersona] = useState(null);
    const [factura, setfactura] = useState(null);
    const [select, setselect] = useState(null);
    const [total, settotal] = useState(null);
    const [totalF, settotalF] = useState(0);
    const [idcliente, setidcliente] = useState(null);
    const [estadoPado, setestadoPado] = useState(null);
    // const [linkfactura, setlinkfactura] = useState(null);
    const [estacedula, setestacedula] = useState(null);
    // const [estadoSpinner, setestadoSpinner] = useState(false);
    const [transacion, settransacion] = useState(null);
    const [selectIdfactura, setselectIdfactura] = useState(null);


    const [data, setdata] = useState([]);
    const [numero, setnumero] = useState(null);
    const [opcional, setopcional] = useState(null);
    const [ticket, setticket] = useState(null);
    const [open_2, setOpen_2] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    function reset() {
        setSaldoInsuficiente(false);
        setEstadoTransaccion(false);
        setEstadoBusqueda(false);
        setEstadoPagar(false);
        seterror(null);
    }

    const Search = async (e) => {
        const { value } = e.target;
        reset();
        var host = dataCliente().host
        var token = dataCliente().token
        console.log(host)
        console.log(token)
        if (value.length === 10 || value.length === 13) {
            setLoading(true)
            setestacedula(value)
            try {
                const { data } = await axios.post('https://rec.netbot.ec/v1/api/cliente', { cedula: value, host, token }, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46YWRtaW4=',
                        'Content-Type': 'application/json'
                    }
                })//buscar cliente
                if (data.success) {
                    setEstadoBusqueda(true);
                    setResultaBusqueda(data.msg);
                    setLoading(false);
                } else {
                    setEstadoBusqueda(false);
                    setLoading(false);
                    setEstadoPagar(true);
                    setselect(data)
                    setidcliente(data[0].idcliente)
                    var Iterable = []
                    let total = 0
                    data.map(items => {
                        total += items.total
                        setResultaBusqueda(items.datosClient)
                        Iterable.push(items.info)
                        localStorage.setItem('dataClient:', JSON.stringify(Iterable))
                    })
                    settotal(`Total a pagar $` + total.toFixed(2))
                }
                //0928676485  1104892367  0923980742001  0911663110  
            } catch (error) {
                seterror("Lo sentimos, no se pudo conectar con el servidor")
                setLoading(false)
            }
        }
    }

    const onChangeTag = async (e) => {
        console.log(e);
        var host = dataCliente().host
        var token = dataCliente().token
        if (e !== "" && e !== "0") {
            let id = e.indexOf(',')
            let idfactura = e
            setfactura(idfactura)
            if (id !== -1) {
                setBloqueoTotal(true)

                const { data } = await axios.post('https://rec.netbot.ec/v1/api/factura', { idfactura, host, token }, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46YWRtaW4=',
                        'Content-Type': 'application/json'
                    }
                })
                setdataPersona(data.description)
                settotalF(data.total)
                setBloqueoPagar(false)
                setselectIdfactura(data.idfactura)
            } else {
                const { data } = await axios.post('https://rec.netbot.ec/v1/api/factura', { idfactura, host, token }, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46YWRtaW4=',
                        'Content-Type': 'application/json'
                    }
                })
                setdataPersona(data.description)
                settotalF(data.total)
                setBloqueoPagar(false)
                setselectIdfactura(data.idfactura)
                setBloqueoTotal(false)
            }
        } else {
            settotalF(0)
            setBloqueoPagar(true)
        }
    }

    const handleChange = async (e) => {
        settotalF(e.target.value)
        setBloqueoPagar(false)
    }

    // function handleClear() {
    //     setestadoPado(null)
    //     setlinkfactura(null)
    // }
    console.log(dataCliente())

    const handleSubmit = async (event) => {
        event.preventDefault();
        var datosCliente = dataClienteId(selectIdfactura)
        if (parseFloat(datosCliente.total) > 0) {
            Swal.fire({
                title: `Esta seguro de realizar el pago de  $${parseFloat(datosCliente.total)} \n a la factura: ${selectIdfactura} \n con fecha de corte : ${datosCliente.fecha_corte}`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await hanblePagar()
                    if (response) {
                        limpiar()
                        Swal.fire({
                            title: 'Pago Exitoso',
                            text: 'El pago se realizo correctamente',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        })
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Lo Sentimo ubo un error al realizar el pago',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })
                    }
                } else if (result.isDenied) {
                    Swal.fire('Cambiar factura a Pagar', '', 'info')
                }
            })
        } else {
            Swal.fire('El valor a pagar no es aceptado', '', 'info')
        }
    }
    const hanblePagar = async () => {
        if (totalF.length > 0) {
            try {
                setLoading(true)
                let info = {
                    "pasarela": dataCliente().nombre_tienda,
                    "id_tienda": dataCliente().id,
                    "total": totalF,
                    "recaudacion": dataCliente().comision,
                    "accounts_id": dataCliente().accounts_id,
                    "idfactura": parseInt(factura),
                    "idcliente": idcliente,
                    "cedula": estacedula,
                    "host": dataCliente().host,
                    "token": dataCliente().token,
                    "token_sistema": dataCliente().token_sistema,
                    "cliente": resultaBusqueda,
                    "telefono": dataClienteId(selectIdfactura).telefono,
                    "movil": dataClienteId(selectIdfactura).movil,
                }
                const { data } = await axios.post('https://rec.netbot.ec/v1/api/pagar', info, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46YWRtaW4=',
                        'Content-Type': 'application/json'
                    }
                })
                if (data.success) {
                    var datosCliente = dataClienteId(selectIdfactura)
                    let info_1 = {
                        "empresa":`${dataCliente().accounts.toUpperCase()} S.A`,
                        "fecha": `${Fecha("DD-MM-YYYY HH:mm:ss")}`,
                        "comision": `${dataCliente().comision}`,
                        "total": `${(parseFloat(datosCliente.total) + parseFloat(dataCliente().comision)).toFixed(2)}`,
                        "cliente": `${resultaBusqueda.substring(0, 25)}`,
                        "direccion": `${datosCliente.direccion.substring(0, 25)}`,
                        "cedula": `${datosCliente.cedula}`,
                        "fecha_corte": `${datosCliente.fecha_corte}`,
                        "numero_control": `${data.transacion_id}`,
                        "link": `${data.link}`,
                    }
                    await GeneraTicket(info_1)
                    setLoading(false)
                    setSaldoInsuficiente(true)
                    setestadoPado(data.data.salida)
                    settransacion(data.transacion_id)
                    setEstadoTransaccion(true)
                    settotalF(null)
                    return true
                } else {
                    setLoading(false)
                    setSaldoInsuficiente(true)
                    setestadoPado(data.msg)
                    return false
                }
            } catch (error) {
                setLoading(false)
                seterror("Lo sentimos, no se pudo conectar con el servidor")
                return false
            }
        } else {
            return false
        }
    }


    function handleOpen2() {
        limpiar()
        setOpen_2(!open_2);
    }
    function limpiar() {
        setnumero(null);
        setopcional(null);
    }

    async function send() {
        var datosCliente = dataClienteGet()
        let movil = datosCliente.movil.replace(/ /g, '').substr(1, 9);
        let telefono = datosCliente.telefono.replace(/ /g, '').substr(1, 9);
        setdata([{ "fn": movil }, { "fn": telefono }])
        handleOpen2()
    }

    const [stn, setstn] = useState(false)
    const [sto, setsto] = useState(false)
    const [stsmsn, setsmsn] = useState('')
    const [stsmso, setsmso] = useState('')

    async function whatsappsend() {
        if (numero != null && numero.length == 9 && ticket != "") {
            const { data } = await axios.post(`${dataCliente().host_whatsapp}/api/send_whatsapp`, {
                from: `593${numero}@c.us`,
                "mensaje": localStorage.getItem(UtimoTicket),
            })
            if (data.success) {
                setstn(data.success)
                setsmsn(data.msg)
            } else {
                setstn(data.success)
                setsmsn(data.msg)
            }
            setTimeout(() => {
                setstn(false)
                setsmsn('')
            }, 3000)
            handleOpen2()
        }

        if (opcional != null && opcional.length == 10 && ticket !== "") {
            const { data } = await axios.post(`${dataCliente().host_whatsapp}/api/send_whatsapp`, {
                from: `593${opcional.replace(/ /g, '').substr(1, 9)}@c.us`,
                "mensaje": localStorage.getItem(UtimoTicket),
            })
            if (data.success) {
                setsto(data.success)
                setsmso(data.msg)
            } else {
                setsto(data.success)
                setsmso(data.msg)
            }
            setTimeout(() => {
                setsto(false)
                setsmso('')
            }, 3000)
            handleOpen2()
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card>

                {stsmsn != '' ? <Alert severity={stn ? "success" : "error"}>{stsmsn}</Alert> : ''}

                {stsmso != '' ? <Alert severity={sto ? "success" : "error"}>{stsmso}</Alert> : ''}


                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <MDBox p={3} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                Buscar Cliente A Pagar
                                <p>Tienda  {dataCliente().nombre_tienda}</p>
                            </MDTypography>
                            <Box sx={{ width: '30%' }}>
                                <FormGroup sx={{ p: 2, minWidth: 120 }} >
                                    <Input label="Buscar Cliente" placeholder="Buscar Cliente" type='number' name="cedula" color="secondary" onChange={Search} />
                                </FormGroup>
                                {loading ?
                                    <>
                                        <CircularProgress
                                            size={100}
                                            value={100}
                                            sx={{
                                                color: blue[500],
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />

                                        <MDTypography variant="h5" fontWeight="medium" sx={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            paddingTop: '10%',
                                            color: blue[500],
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}>
                                            Cargando..
                                        </MDTypography>
                                    </>
                                    : null
                                }
                            </Box>
                        </MDBox>
                        {estadoBusqueda
                            ? <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Resultado del Cliente: {' '} {resultaBusqueda}
                                </MDTypography>
                            </MDBox> : null
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        {estadoPagar ?
                            <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    <p>Cliente: {resultaBusqueda}</p>
                                </MDTypography>
                            </MDBox>
                            : null
                        }
                    </Grid>
                </Grid>
                {estadoPagar ?
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
                        <Grid item xs={12} sm={6} md={6}>
                            <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Detalles:
                                </MDTypography>
                                <Box sx={{ width: '100%' }}>
                                    <FormGroup sx={{ p: 2, minWidth: 120 }} >
                                        <Select
                                            native
                                            onChange={(e) => onChangeTag(e.target.value)}
                                        >
                                            <option value={0} >{total ? "Selecione Valores a pagar" : ''}</option>
                                            {
                                                select ?
                                                    select.map((items, index) => (
                                                        <option key={index} value={items.idfactura} >{items.detalle}</option>
                                                    )) : ''
                                            }
                                        </Select>
                                    </FormGroup>
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    <FormGroup sx={{ p: 2, minWidth: 120 }} >
                                        <Input native value={totalF} disabled={bloqueoTotal} label="Valor a pagar" type='number' placeholder="Ingrese cantidad a paga" name="cedula" color="secondary" onChange={(e) => handleChange(e)} />
                                    </FormGroup>
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    <FormGroup sx={{ p: 3, minWidth: 120 }} >
                                        <Button sx={{ p: 2 }} color="dark" disabled={bloqueoPagar} onClick={handleSubmit}><LocalAtmIcon fontSize="large" />Pagar</Button>
                                    </FormGroup>
                                    <MDTypography variant="body2" fontWeight="regular" color="error" mt={1}>
                                        {error}
                                    </MDTypography>


                                    {loading ?
                                        <>
                                            <CircularProgress
                                                size={100}
                                                value={100}
                                                sx={{
                                                    color: blue[500],
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    marginTop: '-12px',
                                                    marginLeft: '-12px',
                                                }}
                                            />

                                            <MDTypography variant="h5" fontWeight="medium" sx={{
                                                textAlign: 'center',
                                                position: 'absolute',
                                                paddingTop: '10%',
                                                color: blue[500],
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}>
                                                Cargando..
                                            </MDTypography>
                                        </>
                                        : null
                                    }
                                </Box>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium" sx={{ textAlign: 'center' }}>
                                    Detalles <hr />
                                    {dataPersona}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
                    : null}
                {/*estadoTransaccion*/ true ?
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
                        <Grid item xs={12} sm={6} md={6}>
                            <MDBox p={3} fullWidth={true} >
                                <MDTypography variant="h6" fontWeight="medium" sx={{ textAlign: 'left' }} ref={componentRef}>
                                    <p style={{ fontSize: 19, lineHeight: 1.2 }}>{dataCliente().accounts.toUpperCase()} S.A</p>
                                    <p style={{ fontSize: 19, lineHeight: 1.2 }}>COMPROBANTE DE PAGO</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>FECHA: {Fecha("DD-MM-YYYY HH:mm:ss")}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>*****************************************</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>DESCRIPCION</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>*****************************************</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>DESCUENTO: $0.00</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>COMISION: {dataCliente().comision}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>TOTAL: {selectIdfactura !== null ? (parseFloat(dataClienteId(selectIdfactura).total) + parseFloat(dataCliente().comision)).toFixed(2) : "0.0"}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>SALDO: $0.00</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>*****************************************</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>CLIENTE</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>*****************************************</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>NOMBRE: {resultaBusqueda != null ? resultaBusqueda.substring(0, 25) : ''}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>DIRECCION: {selectIdfactura !== null ? dataClienteId(selectIdfactura).direccion.substring(0, 25) : ''}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>CEDULA: {selectIdfactura !== null ? dataClienteId(selectIdfactura).cedula : ''}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>FECHA CORTE: {selectIdfactura !== null ? dataClienteId(selectIdfactura).fecha_corte : ''}</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>*****************************************</p>
                                    <p style={{ fontSize: 16, lineHeight: 1.2 }}>NUMERO CONTROL: {transacion != null ? transacion : ''}</p>
                                </MDTypography>
                                <Button variant='' onClick={handlePrint} >IMPRIMIR</Button>
                                <Button variant='' onClick={send} color='dark'>ENVIAR A WHATSAPP</Button>
                            </MDBox>
                        </Grid>
                    </Grid>
                    : null}
                {saldoInsuficiente
                    ? <MDBox p={3} lineHeight={1} fullWidth={true}>
                        <MDTypography variant="h5" fontWeight="medium">
                            {estadoPado}
                        </MDTypography>
                    </MDBox> : null
                }
            </Card>
            <Modal
                open={open_2}
                onClose={handleOpen2}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: '30%' }}>
                    <div style={{ alignItems: 'center' }}>
                        <h2 id="parent-modal-title">Enviar Comprobante</h2>
                        <br />
                        <label>
                            Numero Whatsapp:
                            <FormControl sx={{ p: 3, minWidth: 120 }} fullWidth={true}>
                                <Select
                                    id="demo-simple-select"
                                    value={numero}
                                    style={{ ...style, height: 50, width: '100%' }}
                                    onChange={(event) => setnumero(event.target.value)}
                                >
                                    {
                                        data != null ? data.map((item, index) => <MenuItem key={index + 1} value={item.fn}>{item.fn}</MenuItem>) : null
                                    }
                                </Select>
                            </FormControl>
                        </label>
                        <RedBar />
                        <label>
                            Numero Opcional:
                            <Input name="opcional" type="text" fullWidth={true} onChange={(event) => setopcional(event.target.value)} />
                        </label>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <br />
                        <Button variant="text" size="large" onClick={whatsappsend}>enviar</Button>
                    </div>
                </Box>

            </Modal>
        </DashboardLayout >
    );
}
function RedBar() {
    return (
        <Box sx={{ height: 20 }} />
    );
}
export default Pagar;
