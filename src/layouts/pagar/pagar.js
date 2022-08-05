/* eslint-disable array-callback-return */


import { Box, Button, Card, FormGroup, Grid, Input, Select } from '@mui/material';
import axios from 'axios';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState } from 'react';



function Pagar(props) {
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [resultaBusqueda, setResultaBusqueda] = useState(null);

    const [estadoPagar, setEstadoPagar] = useState(false);
    const [bloqueoPagar, setBloqueoPagar] = useState(true);

    const [estadoTransaccion, setEstadoTransaccion] = useState(true);

    const [dataPersona, setdataPersona] = useState(null);
    const [datosClient, setdatosClient] = useState(null);
    const [datosTienda, setdatosTienda] = useState(null);
    const [sepuedePagar, seSepuedepagar] = useState(false);
    const [factura, setfactura] = useState(null);
    const [select, setselect] = useState(null);
    const [total, settotal] = useState(null);
    const [totalF, settotalF] = useState(null);
    const [idcliente, setidcliente] = useState(null);
    const [estadoPado, setestadoPado] = useState(null);
    const [linkfactura, setlinkfactura] = useState(null);
    const [estacedula, setestacedula] = useState(null);
    const [estadoSpinner, setestadoSpinner] = useState(false);
    const [info, setinfo] = useState([]);
    const [transacion, settransacion] = useState(null);
    const [comision, setComision] = useState(null);
    const [fecha, setfecha] = useState(null);
    const [infoSelect, setinfoSelect] = useState({
        cedula: null,
        direccion: null,
        fecha_corte: null,
        idfactura: null,
        total: null
    });

    const Search = async (e) => {
        const { value } = e.target;
        if (value.length === 10 || value.length === 13) {
            console.log("entro a la funcion");
            const { data } = await axios.post('https://rec.netbot.ec/v1/api/cliente', { cedula: value }, {
                headers: {
                    'Authorization': 'Basic YWRtaW46YWRtaW4=',
                    'Content-Type': 'application/json'
                }
            })//buscar cliente
            if (data.success) {
                setEstadoBusqueda(true);
                setResultaBusqueda(data.msg);
            } else {
                setEstadoBusqueda(false);
                setEstadoPagar(true);
                setselect(data)
                setidcliente(data[0].idcliente)
                setinfo(data.infoC)
                var Iterable = []
                let total = 0
                data.map(items => {
                    total += items.total
                    setdatosClient(items.datosClient)
                    Iterable.push(items.info)
                    //   localStorage.setItem('dataClient:',JSON.stringify(Iterable))
                })
                settotal(`Total a pagar $` + total.toFixed(2))
            }
            console.log(data)//0928676485  1104892367  0923980742001  0911663110

        }
    }

    const onChangeTag = async (e) => {
        console.log(e);
        if (e !== "") {
            let id = e.indexOf(',')
            let idfactura = e
            setfactura(idfactura)
            if (id !== -1) {
                const x = document.getElementById("total")
                x.disabled = true
                const { data } = await axios.post('https://rec.netbot.ec/v1/api/factura', { idfactura }, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46YWRtaW4=',
                        'Content-Type': 'application/json'
                    }
                })
                setdataPersona(data.description)
                settotalF(data.total)
                setBloqueoPagar(false)
                const dataClient = JSON.parse(localStorage.getItem('dataClient:'))
                if (dataClient != null) {
                    dataClient.map(iten => {
                        if (iten != null) {
                            if (iten.idfactura === idfactura) {
                                setinfoSelect(iten)
                            }
                        }
                    })
                }
            } else {
                const { data } = await axios.post('https://rec.netbot.ec/v1/api/factura', { idfactura }, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46YWRtaW4=',
                        'Content-Type': 'application/json'
                    }
                })
                setdataPersona(data.description)
                settotalF(data.total)
                setBloqueoPagar(false)
                const dataClient = JSON.parse(localStorage.getItem('dataClient:'))
                if (dataClient != null) {
                    dataClient.map(iten => {
                        if (iten != null) {
                            if (iten.idfactura === idfactura) {
                                setinfoSelect(iten)
                            }
                        }
                    })
                }
            }
        }
    }
    const handleChange = async (e) => {
        settotalF(e)
        setBloqueoPagar(false)
    }
    const hanblePagar = async () => {
        if (totalF.length > 0) {
            console.log(totalF)
        }
    }
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card>
                <MDBox p={3} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                        Buscar Cliente A Pagar
                    </MDTypography>
                    <Box sx={{ width: '30%' }}>
                        <FormGroup sx={{ p: 2, minWidth: 120 }} >
                            <Input label="Buscar Cliente" placeholder="Buscar Cliente" name="cedula" color="secondary" onChange={Search} />
                        </FormGroup>
                    </Box>
                </MDBox>
                {estadoBusqueda
                    ? <MDBox p={3} lineHeight={1}>
                        <MDTypography variant="h5" fontWeight="medium">
                            Resultado del Cliente: {' '} {resultaBusqueda}
                        </MDTypography>
                    </MDBox> : null
                }
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
                                        <Input native value={totalF} label="Valor a pagar" placeholder="Ingrese cantidad a paga" name="cedula" color="secondary" onChange={(e) => handleChange(e)} />
                                    </FormGroup>
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    <FormGroup sx={{ p: 3, minWidth: 120 }} >
                                        <Button color="dark" disabled={bloqueoPagar} onClick={hanblePagar}>Pagar</Button>
                                    </FormGroup>
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
                {estadoTransaccion ?
                    <MDBox p={3} fullWidth={true}>
                        <MDTypography variant="h6" fontWeight="medium" sx={{ textAlign: 'left' }}>
                                <p style={{fontSize: 19, lineHeight:1.2}}>COMNET (COMPUTECNICSNET S.A)</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>RUC 092782129001</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>COOP. PANCHO JACOME MZ.240 SL.20</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>FECHA: {fecha != null ? fecha : ''}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>*****************************************</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>DESCRIPCION</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>*****************************************</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>DESCUENTO: $ 0.00</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>COMISION: {comision != null ? "$" + comision : "$0.00"}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>TOTAL: {infoSelect.total != null ? "$" + (parseFloat(infoSelect.total) + parseFloat(comision)).toFixed(2) : "$0.00"}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>SALDO: $0.00</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>*****************************************</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>CLIENTE</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>*****************************************</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>NOMBRE: {datosClient != null ? datosClient.substring(0, 25) : ''}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>DIRECCION: {infoSelect.direccion}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>CEDULA: {infoSelect.cedula}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>FECHA CORTE: {infoSelect.fecha_corte}</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>*****************************************</p>
                                <p style={{fontSize: 16, lineHeight:1.2}}>NUMERO CONTROL: {transacion != null ? transacion : ''}</p>
                        </MDTypography>
                        <Button>IMPRIMIR</Button>
                        <Button>ENVIAR A WHATSAPP</Button>
                    </MDBox>
                    : null}
            </Card>
        </DashboardLayout >
    );
}
export default Pagar;