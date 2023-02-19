import { Directive, Input } from '@angular/core';
import {
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appPasswordConfirmValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordConfirmValidationDirective,
      multi: true,
    },
  ],
})
export class PasswordConfirmValidationDirective implements Validator {
  constructor() {}

  /* Validates if the two password fields are match.
   * @param control AbstractControl
   * @return ValidationErrors | null
   * */
  @Input() firstPassword: any;
  validate(control: AbstractControl): ValidationErrors | null {
    let validate: boolean = false;

    if (control.value === this.firstPassword) {
      validate = true;
    }
    return validate ? null : { unequivalentPassword: true };
  }
}
