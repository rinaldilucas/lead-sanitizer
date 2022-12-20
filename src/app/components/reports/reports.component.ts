import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
    form: FormGroup;

    constructor (
        private formBuilder: FormBuilder

    ) {
        this.form = this.formBuilder.group({
            user: [null],
            price: [null],
            socialmedia: [null, null],
            services: [null, null]
        });
    }

    generate () : void {
        console.log(this.form.value);
    }
}
