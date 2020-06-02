import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

// Servicio global
import { global } from '../services/global';

// Modelo
import { Registrados } from '../models/registrados';



@Injectable({
  providedIn: 'root'
})
export class RegitradosService {
  // atributos de clase
  public url: string;

  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  /**
   * INDEX sirve para sacar todos los registros de los registrados al evento de la base de datos
   */
  public indexRegistro(): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'registrados', { headers: headers });

  }


  /**
   *  // SHOW metodo para mostrar una solo Registrado del evento en concreto
   */
  public showRegistro(idRegistro): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'registrados/' + idRegistro, { headers: headers });

  }

  /**
   * getStoreRegistrados Guarda datos en la base de datos
   */
  public storeRegistro(registrado: Registrados, token: any): Observable<any> {

    const json = JSON.stringify(registrado); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.
    // console.log(params);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.post(this.url + 'registrados', params, { headers: headers });
  }

  /**
   * getUpdateRegistro modifica datos la tabla registrados.
   */
  public updateRegistro(registrado: Registrados, token: any, idRegistrado: number): Observable<any> {

    const json = JSON.stringify(registrado); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.


    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.put(this.url + 'registrados/' + idRegistrado, params, { headers: headers });
  }


  /**
   *  // Destroy elimina un registro de la tabla de datos.
   */
  public destroyRegistro(idRegistrado): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.delete(this.url + 'registrados/' + idRegistrado, { headers: headers });

  }




  // Logica para llenar los pases por dia
  /**
   * pasesDias
   */
  public pasesDias(pases: string, dias: number): Observable<any> {
    console.log(dias);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    return this.http.get(this.url + 'registrados/dias/' + pases, { headers: headers });
  }
}
