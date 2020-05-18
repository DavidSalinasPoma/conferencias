import { Injectable } from '@angular/core';

// Para utilizar los metodos de Http get post put delete etc
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Utilizamos el modelo Invitados
import { Eventos } from '../models/eventos';

// Url globales
import { global } from '../services/global';

// Observable
import { Observable } from 'rxjs'; // permite recoger los datos q nos devuelve el api

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  // Atributos de la clase
  public url: string; // guarda la url de la API.

  // Metodo constructor
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  /**
   * INDEX sirve para sacar todos los registros de eventos de la base de datos
   */
  public indexEvento(): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'eventos', { headers: headers });
  }


  /**
   *  // SHOW metodo para mostrar una solo evento evento en concreto
   */
  public showEvento(idEvento): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'eventos/' + idEvento, { headers: headers });

  }

  /**
   * storeEvento Guarda datos en la base de datos
   */
  public storeEvento(evento: Eventos, token: any): Observable<any> {
    // console.log(invitados);
    const json = JSON.stringify(evento); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.
    // console.log(params);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.post(this.url + 'eventos', params, { headers: headers });
  }

  /**
   * updateEvento modifica datos la tabla eventos.
   */
  public updateEvento(evento: Eventos, token: any, idEvento: number): Observable<any> {
    // console.log(categoria);

    const json = JSON.stringify(evento); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.


    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.put(this.url + 'eventos/' + idEvento, params, { headers: headers });
  }


  /**
   *  // Destroy elimina un registro de la tabla de datos.
   */
  public destroyCategoria(idEvento: number, token: any): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.delete(this.url + 'eventos/' + idEvento, { headers: headers });

  }
}
