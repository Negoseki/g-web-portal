import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

function isEmptyInputValue(value: any): value is void {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

function hasExpectedValues(value: any, expectedValues?: any[]): boolean {
  if (!expectedValues || !expectedValues.length) {
    expectedValues = [true];
  }

  return expectedValues.map(v => value === v).reduce((a, b) => a || b);
}

export function ConditionalRequiredValidator(
  otherControl: FormControl,
  expectedValues?: any[],
  resetControlAutomatically = true
): ValidatorFn {
  let selfControl: AbstractControl;
  if (resetControlAutomatically) {
    otherControl.valueChanges.pipe(filter(() => !!selfControl)).subscribe(() => {
      selfControl.updateValueAndValidity();
    });
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (!selfControl) {
      selfControl = control;
    }

    if (!hasExpectedValues(otherControl.value, expectedValues)) {
      if (control.value !== null) {
        control.setValue(null, { emitEvent: false });
      }
      return null;
    }

    return isEmptyInputValue(control.value) ? { required: true } : null;
  };
}

export interface ConditionHolder {
  otherControl: FormControl;
  expectedValues?: any[];
}

export function MultipleAndConditionalRequiredValidator(conditions: ConditionHolder[], resetControlAutomatically = true): ValidatorFn {
  let selfControl: AbstractControl;
  if (resetControlAutomatically) {
    merge(conditions.map(c => c.otherControl.valueChanges))
      .pipe(filter(() => !!selfControl))
      .subscribe(() => {
        selfControl.updateValueAndValidity();
      });
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (!selfControl) {
      selfControl = control;
    }

    const hasValues = conditions.map(c => hasExpectedValues(c.otherControl.value, c.expectedValues)).reduce((a, b) => a && b);

    if (!hasValues) {
      if (control.value !== null) {
        control.setValue(null, { emitEvent: false });
      }
      return null;
    }

    return isEmptyInputValue(control.value) ? { required: true } : null;
  };
}
export function MultipleOrConditionalRequiredValidator(conditions: ConditionHolder[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasValues = conditions.map(c => hasExpectedValues(c.otherControl.value, c.expectedValues)).reduce((a, b) => a || b);

    if (!hasValues) {
      if (control.value !== null) {
        control.setValue(null, { emitEvent: false });
      }
      return null;
    }

    return isEmptyInputValue(control.value) ? { required: true } : null;
  };
}
