import { Injectable } from '@angular/core';

// Para utilizar los metodos de Http get post put delete etc
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Utilizamos el modelo Invitados
import { Categoria } from '../models/categoria';

// Url globales
import { global } from '../services/global';

// Observable
import { Observable } from 'rxjs'; // permite recoger los datos q nos devuelve el api

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // Atributos de la clase
  public url: string; // guarda la url de la API.

  // Metodo constructor
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  /**
   * INDEX sirve para sacar todos los registros de categori-evento de la base de datos
   */
  public indexCategoria(): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'categoria', { headers: headers });

  }


  /**
   *  // SHOW metodo para mostrar una sola categoria evento en concreto
   */
  public showCatergoria(idCatergoria): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.get(this.url + 'categoria/' + idCatergoria, { headers: headers });

  }

  /**
   * storeCategoria Guarda datos en la base de datos
   */
  public storeCategoria(categoria: Categoria, token: any): Observable<any> {
    // console.log(invitados);
    const json = JSON.stringify(Categoria); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.
    // console.log(params);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // console.log(params);

    // retornamos respuestas de El APIRESTFUL
    return this.http.post(this.url + 'categoria', params, { headers: headers });
  }

  /**
   * updateCategoria modifica datos la tabla regalos.
   */
  public updateCategoria(categoria: Categoria, token: any, idCatergoria: number): Observable<any> {
    // console.log(categoria);

    const json = JSON.stringify(categoria); // convertimos el objeto a json.
    const params = 'json=' + json; // La varible con la que recibe el parametro. en el API.


    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion

    // retornamos respuestas de El APIRESTFUL
    return this.http.put(this.url + 'categoria/' + idCatergoria, params, { headers: headers });
  }


  /**
   *  // Destroy elimina un registro de la tabla de datos.
   */
  public destroyCategoria(idCategoria: number, token: any): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token); // la cabecera de conexion
    // retornamos respuestas de El APIRESTFUL
    return this.http.delete(this.url + 'categoria/' + idCategoria, { headers: headers });

  }

}
