import { Injectable } from '@angular/core';

// Para utilizar los metodos de Http get post put delete etc
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Utilizamos el modelo Invitados
import { Invitados } from '../models/invitados';

// Url globales
import { global } from '../services/global';

// Observable
import { Observable } from 'rxjs'; // permite recoger los datos q nos devuelve el api


@Injectable({
  providedIn: 'root' // Significa que  este servicio podra ser utilizado en cualquier punto de la apliciacion
})
export class InvitadosService {
  // Atributos de la clase
  public url: string; // guarda la url de la API.

  // Metodo constructor
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  /**
   * INDEX sirve para sacar todos los registros de de invitados  de la base de datos
   */
  public indexInvitados(): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'invitados', { headers: headers });

  }


  /**
   *  // SHOW metodo para mostrar una solo Invitado en concreto
   */
  public showInvitados(idInvitados): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'invitados/' + idInvitados, { headers: headers });

  }

  /**
   * storeInvitados Guarda datos en la base de datos
   */
  public storeInvitados(invitados: Invitados, token: any): Observable<any> {
    console.log(invitados);
    const json = JSON.stringify(Invitados); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.
    // console.log(params);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.post(this.url + 'invitados', params, { headers: headers });
  }

  /**
   * updateInvitados modifica datos la tabla regalos.
   */
  public updateInvitados(invitados: Invitados, token: any, idInvitados: number): Observable<any> {


    const json = JSON.stringify(Invitados); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.


    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.put(this.url + 'invitados/' + idInvitados, params, { headers: headers });
  }


  /**
   *  // Destroy elimina un registro de la tabla de datos.
   */
  public destroyInvitados(idInvitados: number): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.delete(this.url + 'invitados/' + idInvitados, { headers: headers });

  }

  // Servicio para fotografias
  /**
   * Guarda y recupera el nombre de la imagen desde Laravel
   */
  public recuperarPhoto(file: File, token: any): Observable<any> {

    const fd = new FormData();
    fd.append('file0', file);

    const headers = new HttpHeaders().set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.post(this.url + 'invitados/upload', fd, { headers: headers });
  }
}
