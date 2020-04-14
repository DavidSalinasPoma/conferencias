import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

// Para formularios reactivos
export function apellidoValidation(): ValidatorFn {
  return (control: AbstractControl) => {
    // tslint:disable-next-line: no-use-before-declare
    const apellidosValidationDirective = new ApellidosValidationDirective();
    return apellidosValidationDirective.validate(control);
  };
}

@Directive({
  selector: '[appApellidosValidation]'
})
export class ApellidosValidationDirective {

  constructor() { }
  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {

    const apellidos = control.value as string;

    // Validacion pàra apellidos
    if (apellidos.length > 50) {
      return { appApellidosValidation: { message: 'El apellido debe contener maximo 50 caracteres.' } };
    }
    if (!apellidos) {
      return { appApellidosValidation: { message: 'El apellido es requerido.' } };
    }
    // Si todo esta bien devuel simplemente.
    return null;
  }


}
