/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import { Box, Button, Card, Input, Modal } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import { dataCliente } from 'function/localstore/storeUsuario';
import { SavePreRegistro } from 'function/util/Query';
import { ListarPreRegistro } from 'function/util/Query';
import React, { useEffect, useState } from 'react';
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

function PreRegistro() {
    const [userTienda, setuserTienda] = useState([]);
    const [open, setOpen] = useState(false);
    const [seve, setSeve] = useState({
        accounts_id: dataCliente().accounts_id,
        tienda_id: dataCliente().id,
        token: dataCliente().token_sistema,
        cliente: '',
        cedula: '',
        direccion: '',
        telefono: '',
        movil: '',
        email: '',
        notas: '',
    });

    const dataTableData = {//963722798
        columns: [
            { Header: "#", accessor: "key", width: "1%" },
            { Header: "Cliente", accessor: "cliente", width: "10%" },
            { Header: "Cedula", accessor: "cedula", width0: "10%" },
            { Header: "Direccion", accessor: "direccion", width: "10%" },
            { Header: "Telefono", accessor: "telefono", width: "10%" },
            { Header: "Movil", accessor: "movil", width: "10%" },
            { Header: "Email", accessor: "email", width: "10%" },
            { Header: "Fecha Registro", accessor: "fecha_instalacion", width: "10%" },
            { Header: "Estado", accessor: "estado_aprobado", width: "10%" },
        ],
        rows: userTienda
    }

    if (userTienda.length > 0) {
        userTienda.map((item, index) => {
            item['key'] = index + 1;
        })
    }

    function handleOpen() {
        setOpen(!open);
    }

    function handleChange(evenr) {
        setSeve({
            ...seve,
            [evenr.target.name]: evenr.target.value
        })
    }

    useEffect(() => {
        (async () => {
            const data = await ListarPreRegistro(dataCliente().id);
            if (data) {
                setuserTienda(data);
            } else {
                setuserTienda([]);
            }
        })()
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        if(seve.cliente !== '' || seve.cedula !== '' || seve.direccion !== '' || seve.telefono !== '' || seve.movil !== '' || seve.email !== ''){
            const response = await SavePreRegistro(seve);
            if (response) {
                setuserTienda(await ListarPreRegistro(dataCliente().id))
                handleOpen();
                Swal.fire({
                    title: 'Registro Exitoso',
                    text: 'Se ha registrado el cliente',
                    type: 'success',
                    confirmButtonText: 'Ok'
                })
               
            }else{
                handleOpen();
                Swal.fire({
                    title: 'Error',
                    text: 'No se ha registrado el cliente',
                    type: 'error',
                    confirmButtonText: 'Ok'
                })
            }

        }else{
            handleOpen();
            Swal.fire({
                title: 'Error!',
                text: 'Todo los Campos son Obligatorios',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card>
                <MDBox p={3} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                        Registrar un nuevo prospecto
                        <Button onClick={handleOpen}>Nuevo Cliente</Button>
                    </MDTypography>
                </MDBox>
                <DataTable
                    table={dataTableData}
                    canSearch
                />
            </Card>
            <Modal
                open={open}
                onClose={handleOpen}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: '30%' }}>
                    <label>
                        Nombre:
                        <Input name="cliente" label="Nombre" fullWidth={true} onChange={handleChange} />
                    </label>
                    <label>
                        Cedula:
                        <Input name="cedula" label="Cedila" fullWidth={true} onChange={handleChange} />
                    </label>
                    <label>
                        Direccion:
                        <Input name="direccion" label="Direccion" fullWidth={true} onChange={handleChange} />
                    </label>
                    <label>
                        Telefono:
                        <Input name="telefono" label="Telefono" fullWidth={true} onChange={handleChange} />
                    </label>
                    <label>
                        Celular:
                        <Input name="movil" label="Celular" fullWidth={true} onChange={handleChange} />
                    </label>
                    <label>
                        Correo:
                        <Input name="email" label="Correo" fullWidth={true} onChange={handleChange} />
                    </label>
                    <label>
                        Nota:
                        <Input name="notas" type="textarea" label="Detalle" fullWidth={true} onChange={handleChange} />
                    </label>
                    <div style={{ textAlign: 'center' }}>
                        <br />
                        <Button variant="text" size="large" onClick={handleSubmit}>Registrar Prospecto</Button>
                    </div>
                </Box>
            </Modal>
        </DashboardLayout>
    )

}

export default PreRegistro;