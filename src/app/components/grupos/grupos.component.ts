import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CosteoService } from 'src/app/services/costeo.service';
import { PendientesService } from 'src/app/services/pendientes.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  tipo: string = 'costeo';
  columns: string[] = [];
  file!: File;
  loading: boolean = false;
  costeadoB: boolean = false;
  costeados: any[] = [];
  comprobacionesPendientes: any[] = []

  constructor(private costeoService: CosteoService, private router: Router, private pendientesService: PendientesService) { }

  ngOnInit(): void {
    let aComprobar = this.pendientesService.comprobacionesPendientes;
    if(aComprobar) {
      this.comprobacionesPendientes = aComprobar;
    }
  }

  handleFileInput(event: any) {
    this.file = event.target.files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let arrayBuffer: any = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      
      let workbook = XLSX.read(bstr, { type: "binary" });
      let firstSheetName = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[firstSheetName];
      
      this.comprobacionesPendientes = XLSX.utils.sheet_to_json(worksheet, { header: 2 }) as any[];
      this.pendientesService.loadComprobacionesPendientes(this.comprobacionesPendientes);
      console.log(this.comprobacionesPendientes);
    }
    fileReader.readAsArrayBuffer(this.file);
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

  descargarCosteados() {
    let newWorkbook = XLSX.utils.book_new();
    // CREAR UNA NUEVA HOJA CON LOS NUEVOS DATOS
    let newWorksheet = XLSX.utils.json_to_sheet(this.costeados);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Costeado');

    // GENERAR EL ARCHIVO PARA DESCARGAR
    let filename;
    if (this.tipo === "costeo") {
      filename = this.file.name.split('.').slice(0, -1).join('.') + "_Costeado.xlsx";
    } else {
      filename = this.file.name.split('.').slice(0, -1).join('.') + "_Comprobado.xlsx";
    }
    XLSX.writeFile(newWorkbook, filename);
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
    this.costeadoB = false;

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

      let newRows: any[] = [];

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
        if (this.tipo == "costeo") {
          this.costeoService.Costear(costeo).subscribe(data => {

            newRows.push({
              "Cliente": data.Costeo.Cliente,
              "Origen": data.Distancia.Origen,
              "Destino": data.Distancia.Destino,
              "Distancia": data.Distancia.Distancia,
              "Observacion": data.Costeo.Observacion,
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
              this.costeados = newRows;
              console.log(this.costeados);
              this.loading = false;
              this.costeadoB = true;
            }
          });
        }

        if (this.tipo == "comprobar") {
          this.costeoService.comprobar(costeo).subscribe(data => {
            console.log(data);

            newRows.push({
              "Cliente": data.Costeo.Cliente,
              "Origen": data.Distancia.Origen,
              "Destino": data.Distancia.Destino,
              "Distancia": data.Distancia.Distancia,
              "Observacion": data.Costeo.Observacion,
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
              this.costeados = newRows;
              console.log(this.costeados);
              this.loading = false;
              this.costeadoB = true;
            }
          });
        }

      }
    };

    fileReader.readAsArrayBuffer(this.file);
  }

  editarCosteo(costeo: any) {
    this.router.navigate(['/costeo', costeo.id]);
  }

  editarComprobacion(i: number) {
    this.router.navigate(['/comprobar', i]);
  }

  descargarRealizados() {
    this.pendientesService.descargarCompro();
  }

}
