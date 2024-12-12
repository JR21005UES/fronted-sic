<template>
    <v-container class="d-flex flex-column align-center justify-center">
      <!-- Cuadro blanco centrado -->
      <v-card class="p-8 centered-card" elevation="4">
        <h1 class="text-center mb-10">Cierre Contable</h1>
  
        <!-- Botón de Cerrar Ciclo Contable -->
        <div class="report-section">
          <v-row justify="center" class="mb-8">
            <v-btn color="primary" class="large-button" elevation="3" @click="cerrarCiclo">
              Cerrar Ciclo Contable
            </v-btn>
          </v-row>
        </div>
  
        <!-- Contenedor de Reportes Pre Cierre -->
        <div class="report-section mb-10">
          <h2 class="text-center mb-6">Reportes Pre Cierre</h2>
          <v-row justify="center" class="gap-2">
            <v-btn color="secondary" elevation="2" class="large-button" @click="generarLibroMayor">
              Libro Mayor
            </v-btn>
            <v-btn color="secondary" elevation="2" class="large-button" @click="generarlBalanza">
              Balanza de Comprobacion
            </v-btn>
            <v-btn color="secondary" elevation="2" class="large-button" @click="generarEstadoResul">
              Estado de Resultado
            </v-btn>
            <v-btn color="secondary" elevation="2" class="large-button" @click="generarBalanzaGen">
              Balance General
            </v-btn>
          </v-row>
        </div>
  
        <!-- Contenedor de Reportes Post Cierre -->
        <div class="report-section mb-8">
          <h2 class="text-center mb-6">Reportes Post Cierre</h2>
          <v-row justify="center" class="gap-8">
            <v-btn color="success" elevation="2" class="large-button" @click="generarDiario">
              Libro Diario
            </v-btn>
            <v-btn color="success" elevation="2" class="large-button" @click="generarBalanzaGenCierre">
              Balance General
            </v-btn>
            <v-btn color="success" elevation="2" class="large-button" @click="generarExcelCierre">
              Partida de Cierre
            </v-btn>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { activarCierre } from '@/composables/useCierreContable';
  import useNoti from "@/composables/useNoti";
  import reporteServices from '@/services/reportes';
  import ExcelJS from 'exceljs';
  import { saveAs } from 'file-saver';
  
  // Variables reactivas
  const mayorTabla = ref([]); // Datos de las cuentas
  const balanzaTabla = ref([]); // Datos de las cuentas
  const estadoTabla = ref([]); // Datos de las cuentas
  const generalTable = ref([]); // Datos de las cuentas
  const diarioTable = ref([]); // Datos de las cuentas
  const generalCierreTable = ref([]); // Datos de las cuentas
  const cierreTable = ref([]); // Datos de las cuentas
  const { notify } = useNoti(); // Inicializar notificaciones
  
  // Cargar datos iniciales
  const llenarLibroMayor = async () => {
    try {
      const { data } = await reporteServices.getLibroMayor();
      mayorTabla.value = data;
      balanzaTabla.value = data;
    } catch (error) {
        notify("Error al cargar los datos", "error");

    }
  };
  const llenarEstadoResul = async () => {
    try {
      const { data } = await reporteServices.getEstadoResultadoCierre();
      estadoTabla.value = data;
    } catch (error) {
        notify("Error al cargar los datos", "error");

    }
  };
  const llenarBalGen = async () => {
    try {
      const { data } = await reporteServices.getBalanceGeneral();
      generalTable.value = data;
    } catch (error) {
        notify("Error al cargar los datos", "error");

    }
  };
  const llenarDiario = async () => {
    try {
      const { data } = await reporteServices.getLibroDiario();
      diarioTable.value = data;
    } catch (error) {
        notify("Error al cargar los datos", "error");

    }
  };
    const llenarGenCierre = async () => {
        try {
        const { data } = await reporteServices.getBalanceGeneralCierre();
        generalCierreTable.value = data;
        } catch (error) {
            notify("Error al cargar los datos", "error");

        }
    };
    const llenarCierre = async () => {
    try {
      const { data } = await reporteServices.getCierre();
      cierreTable.value = data;
    } catch (error) {
        notify("Error al cargar los datos", "error");

    }
  };
  
  // Función para cerrar el ciclo contable
  const cerrarCiclo = () => {
    activarCierre(); // Activa el estado de cierre
    llenarCierre();
    notify("Se ha cerrado el ciclo contable. Puede proceder a descargar los Reportes", "success");
    notify("Se ha deshabilitado el menú lateral", "info");
  };
  
    // Función para generar el Excel del Libro Mayor
    const generarLibroMayor = async () => {
        if (!mayorTabla.value.length) {
        notify("No hay datos para exportar en el Libro Mayor.", "error");
        return;
        }
    
        try {
        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Libro Mayor');
    
        worksheet.mergeCells('B1:G1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
        worksheet.mergeCells('B2:G2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('B2');
        titleCell.value = 'Libro Mayor';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 14 };
        // Agregar encabezados
        worksheet.addRow(['','Cuenta', 'Partida No.', 'Debe', 'Haber', 'Parcial', 'Concepto']).font = { bold: true };
    
        // Iterar sobre las cuentas y agregar los movimientos
        mayorTabla.value.forEach((item) => {
            if (item.movimientos && item.movimientos.length > 0) {
            worksheet.addRow([]); // Espacio antes de los movimientos de cada cuenta
            let totalParcial = 0; // Inicializar el total de parciales para la cuenta
    
            item.movimientos.forEach((movimiento) => {
                worksheet.addRow([
                '',
                item.nombre_cuenta, // Columna para la cuenta
                movimiento.numero_partida, // Columna para el número de partida
                movimiento.debe,
                movimiento.haber,
                movimiento.total,
                movimiento.concepto,
                ]);
                totalParcial = movimiento.total; // Sumar el parcial
            });
    
            // Agregar la fila de suma total para esta cuenta
            worksheet.addRow([
              '',
                `Total de ${item.nombre_cuenta}`, // Texto para la columna "Cuenta"
                '', // Partida No. vacío
                '', // Debe vacío
                '', // Haber vacío
                totalParcial, // Total de parciales
                '', // Concepto vacío
            ]).font = { bold: true }; // Poner la fila de suma en negrita
            }
        });
    
        // Ajustar ancho de columnas
        worksheet.columns = [
            { width: 10 }, // Columna 1: Vacía
            { width: 50 }, // Columna 1: Cuenta
            { width: 10 }, // Columna 2: Partida No.
            { width: 15 }, // Columna 3: Debe
            { width: 15 }, // Columna 4: Haber
            { width: 15 }, // Columna 5: Parcial
            { width: 40 }, // Columna 6: Concepto
        ];
    
        // Crear el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
    
        // Descargar el archivo
        saveAs(new Blob([buffer]), 'Final_Libro_Mayor.xlsx');
    
        // Notificar éxito
        notify("El archivo de Libro Mayor se generó exitosamente.", "success");
        } catch (error) {
        notify("Error al generar el archivo de Libro Mayor.", "error");
        }
    };
    // Función para generar el Excel de la Balanza de Comprobación
    const generarlBalanza = async () => {
    if (!mayorTabla.value.length) {
        notify("No hay datos para exportar en el Libro Mayor.", "error");
        return;
    }

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Balanza de Comprobación');

    worksheet.mergeCells('B1:G1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
      worksheet.mergeCells('B2:G2'); // Fusionar celdas para el título
      const titleCell = worksheet.getCell('B2');
      titleCell.value = 'Balanza de Comprobación';
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.font = { bold: true, size: 14 };

    // Agregar encabezados
    worksheet.addRow(['','Código', 'Nombre de la Cuenta', 'Debe', 'Haber', 'Saldo Deudor', 'Saldo Acreedor']).font = {
        bold: true,
    };

    // Agregar datos de la tabla principal
    mayorTabla.value.forEach((item) => {
        worksheet.addRow([
        '', // Vacío en la columna 1
        item.codigo,
        item.nombre_cuenta,
        item.debe,
        item.haber,
        item.total_deudor,
        item.total_acreedor,
        ]);
    });

    // Ajustar ancho de columnas
    worksheet.columns = [
        { width: 10 }, // Columna 1: Vacía
        { width: 10 }, // Columna 1: Código
        { width: 30 }, // Columna 2: Nombre de la Cuenta
        { width: 15 }, // Columna 3: Debe
        { width: 15 }, // Columna 4: Haber
        { width: 15 }, // Columna 5: Saldo Deudor
        { width: 15 }, // Columna 6: Saldo Acreedor
    ];

    // Crear el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Descargar el archivo
    saveAs(new Blob([buffer]), 'Final_Balanza_Comprobacion.xlsx');
    notify("El archivo de Balanza de Comprobacion se generó exitosamente.", "success");

    };
    const generarEstadoResul     = async () => {
    if (!estadoTabla.value.length) {
        notify("NO HAY DATOS PARA EXPORTAR", "error");
        return;
    }

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Esado de Resultado');

    // Agregar un título
    worksheet.mergeCells('B1:C1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
        worksheet.mergeCells('B2:C2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('B2');
        titleCell.value = 'Estado de Resultado';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 14 };

    // Agregar encabezados de la tabla
    worksheet.addRow(['', 'Cuenta', 'Parcial']).font = { bold: true };

    // Agregar datos
    estadoTabla.value.forEach((item) => {
        worksheet.addRow(['', item.nombre_cuenta, item.total]);
    });

    // Ajustar ancho de columnas
    worksheet.columns = [
        { width: 10 }, // Columna 1: Vacía
        { width: 40 }, // Columna 2: Cuenta
        { width: 15 }, // Columna 3: Parcial
    ];

    // Crear el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Descargar el archivo
    saveAs(new Blob([buffer]), 'Final_Estado_Resultado.xlsx');
    notify("El archivo de Estado de Resultado se generó exitosamente.", "success");
    };
    const generarBalanzaGen = async () => {
    if (!generalTable.value.length) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Balance General');

    // Agregar un título
    worksheet.mergeCells('B1:C1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
        worksheet.mergeCells('B2:C2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('B2');
        titleCell.value = 'Balance General Cierre';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 14 };
    // Agregar encabezados de la tabla
    worksheet.addRow([ '','Cuenta', 'Parcial']).font = { bold: true };

    // Agregar datos
    generalTable.value.forEach((item) => {
        worksheet.addRow(['',item.nombre_cuenta, item.total]);
    });

    // Ajustar ancho de columnas
    worksheet.columns = [
        { width: 10 }, // Columna 1: Vacía
        { width: 40 }, // Columna 2: Cuenta
        { width: 15 }, // Columna 3: Parcial
    ];
    
    const titleCell3 = worksheet.getCell('B18');
        titleCell3.value = 'Firma';
        titleCell3.alignment = { vertical: 'middle' }; // Centrar el texto
        titleCell3.font = { bold: true, size: 14 }; // Estilo de la fuente

        const titleCell4 = worksheet.getCell('C18');
        titleCell4.value = 'Firma';
        titleCell4.alignment = { vertical: 'middle' }; // Centrar el texto
        titleCell4.font = { bold: true, size: 14 }; // Estilo de la fuente

    // Crear el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Descargar el archivo
    saveAs(new Blob([buffer]), 'Final_Balance_General.xlsx');
    notify("El archivo de Balance General se generó exitosamente.", "success");
    };
    const generarDiario = async () => {
    if (!diarioTable.value.length) {
        notify("No hay datos para exportar", "error");
        return;
    }

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Libro Diario');

    // Agregar un título
    worksheet.mergeCells('A1:E1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('A1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
        worksheet.mergeCells('A2:E2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('A2');
        titleCell.value = 'Libro Diario';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 14 };

    // Agregar encabezados de la tabla principal
    worksheet.addRow(['Número de Partida', 'Código', 'Nombre de Cuenta', 'Debe', 'Haber']).font = { bold: true };

    // Iterar sobre las partidas y agregar los movimientos
    diarioTable.value.forEach((partida) => {
        // Agregar una fila para el número de partida
        worksheet.addRow([`Partida ${partida.numero_partida}`, '', '', '', '']).font = { bold: true, size: 12 };

        // Agregar los movimientos de la partida
        partida.movimientos.forEach((movimiento) => {
        worksheet.addRow([
            '', // Número de partida vacío en los movimientos
            movimiento.codigo,
            movimiento.nombre_cuenta,
            movimiento.debe.toFixed(2),
            movimiento.haber.toFixed(2),
        ]);
        });

        // Agregar una fila para el concepto al final de los movimientos
        const conceptoRow = worksheet.addRow([`Concepto: ${partida.concepto}`, '', '', '', '']);
        worksheet.mergeCells(`A${conceptoRow.number}:E${conceptoRow.number}`); // Combinar celdas de A a E
        conceptoRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar texto
        conceptoRow.font = { italic: true, size: 11 }; // Aplicar estilo al concepto

        // Espacio entre partidas
        worksheet.addRow([]);
    });

    // Ajustar ancho de columnas
    worksheet.columns = [
        { width: 20 }, // Columna 1: Número de Partida
        { width: 15 }, // Columna 2: Código
        { width: 45 }, // Columna 3: Nombre de Cuenta
        { width: 15 }, // Columna 4: Debe
        { width: 15 }, // Columna 5: Haber
    ];

    // Crear el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Descargar el archivo
    saveAs(new Blob([buffer]), 'Final_Libro_Diario.xlsx');
    notify("El archivo de Libro Diario se generó exitosamente", "success");
    };
    const generarBalanzaGenCierre = async () => {
    if (!generalCierreTable.value.length) {
        notify("No hay datos para exportar", "error");
        await llenarGenCierre(); // Intentar cargar los datos si no están disponibles
        return;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Balance General Cierre');

        worksheet.mergeCells('B1:C1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
        worksheet.mergeCells('B2:C2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('B2');
        titleCell.value = 'Balance General Cierre';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 14 };

        // Agregar encabezados
        worksheet.addRow(['','Cuenta', 'Parcial']).font = { bold: true };

        // Agregar datos
        generalCierreTable.value.forEach((item) => {
            worksheet.addRow(['',item.nombre_cuenta, item.total]);
        });

        // Ajustar ancho de columnas
        worksheet.columns = [
            { width: 10 }, // Columna 1: Vacía
            { width: 40 }, // Columna 1: Cuenta
            { width: 15 }, // Columna 2: Parcial
        ];
        const titleCell3 = worksheet.getCell('B18');
        titleCell3.value = 'Firma';
        titleCell3.alignment = { vertical: 'middle' }; // Centrar el texto
        titleCell3.font = { bold: true, size: 14 }; // Estilo de la fuente

        const titleCell4 = worksheet.getCell('C18');
        titleCell4.value = 'Firma';
        titleCell4.alignment = { vertical: 'middle' }; // Centrar el texto
        titleCell4.font = { bold: true, size: 14 }; // Estilo de la fuente

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'Final_Balance_General_Post_Cierre.xlsx');
        notify("El archivo de Balance General Post Cierre se generó exitosamente.", "success");
    } catch (error) {
        notify("Error al generar el archivo de Balance General Post Cierre.", "error");
        console.error("Error al generar el archivo Excel:", error);
    }
};

    const generarExcelCierre = async () => {
    if (!cierreTable.value.length) {
        notify("No hay datos para exportar", "error");
        return;
    }

    try {
        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cierre Contable');

        // Agregar un título
        worksheet.mergeCells('B1:C1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente

        // Agregar un título
        worksheet.mergeCells('B2:C2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('B2');
        titleCell.value = 'Reporte de Cierre Contable';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell.font = { bold: true, size: 14 }; // Estilo de la fuente

        // Agregar encabezados de la tabla (empezando desde la columna B)
        worksheet.addRow(['', 'Nombre de la Cuenta', 'Total']).font = { bold: true };

        // Iterar sobre los datos de cierreTable y agregarlos al Excel
        cierreTable.value.forEach((item) => {
            worksheet.addRow([
                '', // Dejar la columna A vacía
                item.nombre_cuenta,
                item.total.toFixed(2), // Formatear el total con dos decimales
            ]);
        });

        // Ajustar ancho de columnas
        worksheet.columns = [
            { width: 10 }, // Columna A: Vacía
            { width: 40 }, // Columna B: Nombre de la Cuenta
            { width: 20 }, // Columna C: Total
        ];

        // Crear el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // Descargar el archivo
        saveAs(new Blob([buffer]), 'Final_Reporte_Cierre_Contable.xlsx');

        // Notificar éxito
        notify("Reporte de Cierre Contable generado exitosamente", "success");
    } catch (error) {
        console.error('Error al generar el archivo Excel:', error);
        notify("Error al generar el archivo de Cierre Contable.", "error");
    }
};


  
  
  // Llenar la tabla al montar el componente
  onMounted(() => {
    llenarLibroMayor();
    llenarEstadoResul();
    llenarBalGen();
    llenarDiario();
    llenarGenCierre();
  });
  
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .centered-card {
    width: 80%;
    max-width: 1000px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .report-section {
    width: 100%;
    text-align: center;
  }
  
  .large-button {
    font-size: 1rem;
    padding: 12px 24px;
    width: 300px;
  }
  
  .v-row {
    gap: 24px;
  }
  </style>
  