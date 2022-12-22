import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { StateService } from '../services/state.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
    @ViewChild('services', { read: MatAutocompleteTrigger }) servicesTrigger!: MatAutocompleteTrigger;
    form: FormGroup;

    services: string[] = ['Curtidas', 'Views', 'Seguidores Premium', 'Seguidores Brasileiros', 'Seguidores Mundiais', 'Reels', 'Comentários', 'Repostagens', 'Plays', 'Tráfego', 'Retweets', 'Membros', 'Horas assistidas', 'Live'];
    medias: string[] = ['Instagram', 'Facebook', 'Youtube', 'Tiktok', 'Kwai', 'Telegram', 'Spotify', 'Twitter', 'Google', 'Twitch', 'Soundcloud'];
    filteredMedias: Observable<string[]>;
    filteredServices: Observable<string[]>;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    selectedMedias: string[] = [];
    selectedServices: string[] = [];

    instagramContainers = [0];

    @ViewChild('mediaInput') mediaInput: ElementRef<HTMLInputElement>;
    @ViewChild('serviceInput') serviceInput: ElementRef<HTMLInputElement>;

    constructor (
        private formBuilder: FormBuilder,
        private router: Router,
        private stateService: StateService
    ) {
        this.form = this.formBuilder.group({
            user: [null, Validators.required],
            price: [null, Validators.required],
            medias: [null, Validators.required],
            services: [null, Validators.required],
            instagram: this.formBuilder.array([this.formBuilder.group({
                instagramQty_0: [null, Validators.required],
                instagramCortesy_0: [null, Validators.required],
                instagramService_0: [null, Validators.required],
                instagramUrl_0: [null, Validators.required]
            })])
        });

        this.filteredMedias = this.form.controls['medias'].valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filterMedia(fruit) : this.medias.slice()))
        );

        this.filteredServices = this.form.controls['services'].valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filterServices(fruit) : this.services.slice()))
        );
    }

    generateReport () : void {
        if (this.form.valid) {
            const obj = { ...this.form.value };
            this.stateService.data = obj;
            this.router.navigate(['viewer']);
        }
    }

    addMedia (event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) { this.selectedMedias.push(value); }
        event.chipInput.clear();
        this.form.controls['medias'].setValue(null);
    }

    addService (event: MatChipInputEvent): void {
        debugger;
        const value = (event.value || '').trim();
        if (value) { this.selectedServices.push(value); }
        event.chipInput.clear();
        this.form.controls['services'].setValue(null);
    }

    removeMedia (option: string): void {
        const index = this.selectedMedias.indexOf(option);
        if (index >= 0) { this.selectedMedias.splice(index, 1); }
    }

    removeService (option: string): void {
        const index = this.selectedServices.indexOf(option);
        if (index >= 0) { this.selectedServices.splice(index, 1); }
    }

    private _filterMedia (value: string): string[] {
        const filterValue = value.toString().toLowerCase();
        return this.medias.filter(option => option.toLowerCase().includes(filterValue));
    }

    private _filterServices (value: string): string[] {
        const filterValue = value.toString().toLowerCase();
        return this.services.filter((option) => option.toLowerCase().includes(filterValue));
    }

    selectMedia (event: MatAutocompleteSelectedEvent): void {
        this.selectedMedias.push(event.option.viewValue);
        this.mediaInput.nativeElement.value = '';
        this.form.controls['medias'].setValue(this.selectedMedias.toString().replace(/,/g, ', '));
    }

    selectService (event: MatAutocompleteSelectedEvent): void {
        this.selectedServices.push(event.option.viewValue);
        this.serviceInput.nativeElement.value = '';
        this.form.controls['services'].setValue(this.selectedServices.toString().replace(/,/g, ', '));
    }

    addInstagramLine (i: any): void {
        this.instagramContainers.push(this.instagramContainers.length);
        const instagram = this.form.controls['instagram'] as FormArray;

        const formControlFields = [
            {
                name: 'instagramQty_' + (i + 1),
                control: new FormControl(null, Validators.required)
            },
            {
                name: 'instagramCortesy_' + (i + 1),
                control: new FormControl(null, Validators.required)
            },
            {
                name: 'instagramService_' + (i + 1),
                control: new FormControl(null, Validators.required)
            },
            {
                name: 'instagramUrl_' + (i + 1),
                control: new FormControl(null, Validators.required)
            }
        ];

        instagram.push(this.formBuilder.group({}));
        formControlFields.forEach(f => (<FormGroup>instagram.controls[i + 1]).addControl(f.name, f.control));
    }
}
