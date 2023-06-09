import { Component } from '@angular/core';
import { CosteoService } from 'src/app/services/costeo.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {
  tipo: string = 'costeo';
  columns: string[] = [];
  file!: File;
  loading: boolean = false;

  constructor(private costeoService: CosteoService) { }

  handleFileInput(event: any) {
    this.file = event.target.files.item(0);
  }

  cambiarCos() {
    this.tipo = 'costeo';
  }

  cambiarCom() {
    this.tipo = 'comprobar';
  }

  descargarCosteo() {
    const fileName = 'Formato Costeo.xlsx';
    const assetUrl = 'assets/Formatos/Formato Costeo.xlsx';

    // Crear un elemento <a> temporal para simular la descarga
    const anchor = document.createElement('a');
    anchor.href = assetUrl;
    anchor.download = fileName;

    // Adjuntar el elemento <a> al DOM y hacer clic en él para iniciar la descarga
    document.body.appendChild(anchor);
    anchor.click();

    // Limpiar, removiendo el elemento <a> del DOM
    document.body.removeChild(anchor);
  }

  descargarComprobacion() {
    const fileName = 'Formato Comprobacion.xlsx';
    const assetUrl = 'assets/Formatos/Formato Comprobacion.xlsx';

    // Crear un elemento <a> temporal para simular la descarga
    const anchor = document.createElement('a');
    anchor.href = assetUrl;
    anchor.download = fileName;

    // Adjuntar el elemento <a> al DOM y hacer clic en él para iniciar la descarga
    document.body.appendChild(anchor);
    anchor.click();

    // Limpiar, removiendo el elemento <a> del DOM
    document.body.removeChild(anchor);
  }

  cotizar() {
    let costeo: any = {};
    let fileReader = new FileReader();
    let newWorkbook = XLSX.utils.book_new();

    fileReader.onload = (e) => {
      let arrayBuffer: any = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");

      let workbook = XLSX.read(bstr, { type: "binary" });
      let firstSheetName = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[firstSheetName];

      let rows = XLSX.utils.sheet_to_json(worksheet, { header: 2 }) as any[];

      let newRows: any[] = []; // To store the new data

      this.loading = true;
      let count = 0;
      for (let row of rows) {
        let dict: { [key: string]: any } = {};
        for (let cellIndex in row) {
          dict[cellIndex] = row[cellIndex];
        }
        costeo.cliente = dict['Cliente'];
        if (dict['Utilidad']) {
          costeo.utili = dict['Utilidad'];
        }
        if (dict['Flete']) {
          costeo.Flete_total = dict['Flete'];
        }
        costeo.comp = dict['Compensacion'];
        costeo.tipo_vh = dict['TipoVh'];
        costeo.observacion = dict['Observacion'];
        costeo.ciudades = [dict['Origen'], dict['Destino']];
        if (dict['Ecuador']) {
          costeo.ciudad_ecuador = dict['Ecuador'];
          if (dict['Loraver']) {
            costeo.loraver = dict['Loraver'];
          }
        }

        /* FUNCION CUANDO ES COSTEO */
        if(this.tipo == "costeo") {
          this.costeoService.Costear(costeo).subscribe(data => {
            console.log(data);
  
            newRows.push({
              "Cliente": data.Costeo.Cliente,
              "Origen": data.Distancia.Origen,
              "Destino": data.Distancia.Destino,
              "Distancia": data.Distancia.Distancia,
              "Observación": data.Costeo.Observacion,
              "Tipo_Vh": data.Costeo.Tipo_vehiculo,
              "Compensacion": data.Costeo.Compensacion,
              "Flete": data.Costeo.Ingresos.Flete_total,
              "Utilidad": data.Costeo.Ingresos.porcentaje_utilidad,
              "EBITDA": data.Costeo.Ingresos.EBITDA,
              "Costos_Totales": data.Costeo.Costos.Costos_Totales,
              "Peajes": data.Peajes.peajesTotales,
              "Depreciacion": data.Costeo.Costos.Depreciacion,
              "Costos_Fijos": data.Costeo.Costos.Costos_Fijos.Total_fijos,
              "Costos_Variables": data.Costeo.Costos.Costos_Variables.Total_variables
            });
  
            count++;
            if (count === rows.length) {
              this.loading = false;
  
              // CREAR UNA NUEVA HOJA CON LOS NUEVOS DATOS
              let newWorksheet = XLSX.utils.json_to_sheet(newRows);
              XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Costeado');
  
              // GENERAR EL ARCHIVO PARA DESCARGAR
              let filename = this.file.name.split('.').slice(0, -1).join('.') + "_Costeado.xlsx";
              XLSX.writeFile(newWorkbook, filename);
            }
          });
        }

        if(this.tipo == "comprobar") {
          this.costeoService.comprobar(costeo).subscribe(data => {
            console.log(data);

            newRows.push({
              "Cliente": data.Costeo.Cliente,
              "Origen": data.Distancia.Origen,
              "Destino": data.Distancia.Destino,
              "Distancia": data.Distancia.Distancia,
              "Observación": data.Costeo.Observacion,
              "Tipo_Vh": data.Costeo.Tipo_vehiculo,
              "Compensacion": data.Costeo.Compensacion,
              "Flete": data.Costeo.Ingresos.Flete_total,
              "Utilidad": data.Costeo.Ingresos.porcentaje_utilidad,
              "EBITDA": data.Costeo.Ingresos.EBITDA,
              "Costos_Totales": data.Costeo.Costos.Costos_Totales,
              "Peajes": data.Peajes.peajesTotales,
              "Depreciacion": data.Costeo.Costos.Depreciacion,
              "Costos_Fijos": data.Costeo.Costos.Costos_Fijos.Total_fijos,
              "Costos_Variables": data.Costeo.Costos.Costos_Variables.Total_variables
            });

            count++;
            if (count === rows.length) {
              this.loading = false;
  
              // CREAR UNA NUEVA HOJA CON LOS NUEVOS DATOS
              let newWorksheet = XLSX.utils.json_to_sheet(newRows);
              XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Costeado');
  
              // GENERAR EL ARCHIVO PARA DESCARGAR
              let filename = this.file.name.split('.').slice(0, -1).join('.') + "_Costeado.xlsx";
              XLSX.writeFile(newWorkbook, filename);
            }
          });
        }

      }
    };

    fileReader.readAsArrayBuffer(this.file);
  }


}
