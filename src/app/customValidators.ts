import {FormGroup, ValidatorFn} from "@angular/forms";

export class CustomValidators {

    static correctYearSpan(controlName1: string, controlName2: string): ValidatorFn {
        return (formGroup: FormGroup): { [key: string]: any } | null => {
            const control1 = formGroup.get(controlName1);
            const control2 = formGroup.get(controlName2);
            if (control1.value > control2.value) {
                formGroup.setErrors({mustMatch: true});
                // control1.setErrors({ mustMatch: true });
                // control2.setErrors({ mustMatch: true });
                return {"invalidYearSpan": {value: formGroup.value}};
            } else {
                formGroup.setErrors(null);
                // control1.setErrors(null);
                // control2.setErrors(null);
                return null;
            }
        };
    }
}
