import { Injectable } from '@angular/core';

// Para utilizar los metodos de Http get post put delete etc
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Utilizamos el modelo USER
import { Regalos } from '../models/regalos';

// Url globales
import { global } from '../services/global';

// Observable
import { Observable } from 'rxjs'; // permite recoger los datos q nos devuelve el api


@Injectable({
  providedIn: 'root' // Significa que  este servicio podra ser utilizado en cualquier punto de la apliciacion
})
export class RegalosService {
  // Atributos de la clase
  public url: string; // guarda la url de la API.

  // Metodo constructor
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  /**
   * INDEX sirve para sacar todos los registros de los regalos  de la base de datos
   */
  public indexRegalos(): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'regalos', { headers: headers });

  }


  /**
   *  // SHOW metodo para mostrar una solo Regalo en concreto
   */
  public showRegalos(idRegalos): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'regalos/' + idRegalos, { headers: headers });

  }

  /**
   * getStorePerfil Guarda datos en la base de datos
   */
  public storePerfil(regalos: Regalos, token: any): Observable<any> {

    const json = JSON.stringify(regalos); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.
    // console.log(params);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.post(this.url + 'regalos', params, { headers: headers });
  }

  /**
   * getUpdatePerfil modifica datos la tabla regalos.
   */
  public updatePerfil(regalos: Regalos, token: any, idRegalos: number): Observable<any> {

    const json = JSON.stringify(regalos); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.


    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.put(this.url + 'regalos/' + idRegalos, params, { headers: headers });
  }


  /**
   *  // Destroy elimina un registro de la tabla de datos.
   */
  public destroyRegalos(idRegalos): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.delete(this.url + 'regalos/' + idRegalos, { headers: headers });

  }
}

