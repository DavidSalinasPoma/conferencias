import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

// Para formularios reactivos
export function passwordValidation(): ValidatorFn {
  return (control: AbstractControl) => {
    // tslint:disable-next-line: no-use-before-declare
    const passwordValidationDirective = new PasswordValidationDirective();
    return passwordValidationDirective.validate(control);
  };
}

// para formularios de plantillas


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appPasswordValidation]',
  // angular determina que esta directiva en un validador
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidationDirective, multi: true }]
})
export class PasswordValidationDirective implements Validator {

  // Creamos nuestro arreglo de passwords prohibidos

  public passwordsProhibidos: any[];

  constructor() {
    // Inicalizacion de los atributos de clase
    this.passwordsProhibidos = ['123456', 'querty', '123456789'];
  }
  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {
    const password = control.value as string; // Estamos casteando

    // Si no hay ningun password escrito retornamos nada
    if (!password) { return; }
    if (password.length < 8) {
      return;
    }

    // Ahora nuestro password personalizado
    if (this.passwordsProhibidos.indexOf(password) !== -1) {
      return { appPasswordValidation: { message: 'Escoge un mejor password' } };
    }

    // Debe contener al menos una mayuscula
    if (password === password.toLocaleLowerCase()) {
      return { appPasswordValidation: { message: 'tu password debe contener  mayúsculas.' } };
    }

    // Debe contener al menos una minuscula
    if (password === password.toLocaleUpperCase()) {
      return { appPasswordValidation: { message: 'tu password debe contener minúsculas.' } };
    }

    // Debe contener al menos una minuscula
    // if (!/\d/.test(password)) {
    if (!(/\d/).test(password)) {
      return { appPasswordValidation: { message: 'tu password debe incluir un caracter numérico.' } };
    }

    // Si todo esta bien devuel simplemente.
    return null;
  }

}
