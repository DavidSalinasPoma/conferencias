import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';


// Para formularios reactivos
export function nombreValidation(): ValidatorFn {
  return (control: AbstractControl) => {
    // tslint:disable-next-line: no-use-before-declare
    const nombreValidationDirective = new NombreValidationDirective();
    return nombreValidationDirective.validate(control);
  };
}



@Directive({
  selector: '[appNombreValidation]',
  // angular determina que esta directiva en un validador
  providers: [{ provide: NG_VALIDATORS, useExisting: NombreValidationDirective, multi: true }]
})
export class NombreValidationDirective implements Validator {

  constructor() {
  }

  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {



    const nombres = control.value as string; // Estamos casteando

    // Validacion para nombres
    if (!nombres) {
      return { appNombreValidation: { message: 'El nombre es requerido.' } };
    }
    if (nombres.length > 50) {
      return { appNombreValidation: { message: 'El nombre debe contener maximo 50 caracteres.' } };
    }

    // Si todo esta bien devuel simplemente.
    return null;
  }


}
