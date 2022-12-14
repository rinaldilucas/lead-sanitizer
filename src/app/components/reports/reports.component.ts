import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { StateService } from '../_shared/services/state.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
    @ViewChild('mediaInput', { read: MatAutocompleteTrigger }) servicesTrigger!: MatAutocompleteTrigger;
    @ViewChild('serviceInput', { read: MatAutocompleteTrigger }) mediasTrigger!: MatAutocompleteTrigger;
    form: FormGroup;

    services: string[] = ['curtidas', 'views', 'seguidores premium', 'seguidores brasileiros', 'seguidores mundiais', 'reels', 'comentários', 'repostagens', 'plays', 'tráfego', 'retweets', 'membros', 'horas assistidas', 'live'];
    medias: string[] = ['instagram', 'facebook', 'youtube', 'tiktok', 'kwai', 'telegram', 'spotify', 'twitter', 'google', 'twitch', 'soundcloud'];
    filteredMedias: Observable<string[]>;
    filteredServices: Observable<string[]>;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    selectedMedias: string[] = [];
    selectedServices: string[] = [];
    containers: any[] = [
        { title: 'instagram', items: [] },
        { title: 'facebook', items: [] },
        { title: 'youtube', items: [] },
        { title: 'tiktok', items: [] },
        { title: 'kwai', items: [] },
        { title: 'telegram', items: [] },
        { title: 'spotify', items: [] },
        { title: 'twitter', items: [] },
        { title: 'google', items: [] },
        { title: 'twitch', items: [] },
        { title: 'soundcloud', items: [] }
    ];

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
            instagram: this.formBuilder.array([]),
            facebook: this.formBuilder.array([]),
            youtube: this.formBuilder.array([]),
            tiktok: this.formBuilder.array([]),
            kwai: this.formBuilder.array([]),
            telegram: this.formBuilder.array([]),
            spotify: this.formBuilder.array([]),
            twitter: this.formBuilder.array([]),
            google: this.formBuilder.array([]),
            twitch: this.formBuilder.array([]),
            soundcloud: this.formBuilder.array([])
        });

        this.filteredMedias = this.form.controls['medias'].valueChanges.pipe(
            startWith(null),
            map((media: string | null) => (media ? this._filterMedia(media) : this.medias.slice()))
        );

        this.filteredServices = this.form.controls['services'].valueChanges.pipe(
            startWith(null),
            map((service: string | null) => (service ? this._filterServices(service) : this.services.slice()))
        );
    }

    generateReport () : void {
        if (this.form.valid) {
            const formData = { ...this.form.value };
            this.stateService.data = formData;
            this.router.navigate(['viewer']);
        }
    }

    addMedia (event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) { this.selectedMedias.push(value); }
        event.chipInput.clear();
    }

    addService (event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) { this.selectedServices.push(value); }
        event.chipInput.clear();
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
        this.addLine(event.option.viewValue.toLocaleLowerCase(), 0);
    }

    selectService (event: MatAutocompleteSelectedEvent): void {
        this.selectedServices.push(event.option.viewValue);
        this.serviceInput.nativeElement.value = '';
        this.form.controls['services'].setValue(this.selectedServices.toString().replace(/,/g, ', '));
    }

    addLine (text: string, i: number): void {
        text = text.toLocaleLowerCase();

        const formControlFields = [{
            name: text + 'Qty_' + (i + 1),
            control: new FormControl(null, Validators.required)
        }, {
            name: text + 'Cortesy_' + (i + 1),
            control: new FormControl(null, Validators.required)
        }, {
            name: text + 'Service_' + (i + 1),
            control: new FormControl(null, Validators.required)
        }, {
            name: text + 'Url_' + (i + 1),
            control: new FormControl(null, Validators.required)
        }];

        const selectedMediaContainer = this.containers.find(c => c.title === text);
        selectedMediaContainer?.items.push(selectedMediaContainer?.items.length);
        switch (text) {
        case 'instagram':
            const instagram = this.form.controls['instagram'] as FormArray;
            instagram.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>instagram.controls[i]).addControl(f.name, f.control));
            break;
        case 'facebook':
            const facebook = this.form.controls['facebook'] as FormArray;
            facebook.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>facebook.controls[i]).addControl(f.name, f.control));
            break;
        case 'youtube':
            const youtube = this.form.controls['youtube'] as FormArray;
            youtube.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>youtube.controls[i]).addControl(f.name, f.control));
            break;
        case 'tiktok':
            const tiktok = this.form.controls['tiktok'] as FormArray;
            tiktok.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>tiktok.controls[i]).addControl(f.name, f.control));
            break;
        case 'kwai':
            const kwai = this.form.controls['kwai'] as FormArray;
            kwai.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>kwai.controls[i]).addControl(f.name, f.control));
            break;
        case 'telegram':
            const telegram = this.form.controls['telegram'] as FormArray;
            telegram.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>telegram.controls[i]).addControl(f.name, f.control));
            break;
        case 'spotify':
            const spotify = this.form.controls['spotify'] as FormArray;
            spotify.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>spotify.controls[i]).addControl(f.name, f.control));
            break;
        case 'twitter':
            const twitter = this.form.controls['twitter'] as FormArray;
            twitter.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>twitter.controls[i]).addControl(f.name, f.control));
            break;
        case 'google':
            const google = this.form.controls['google'] as FormArray;
            google.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>google.controls[i]).addControl(f.name, f.control));
            break;
        case 'twitch':
            const twitch = this.form.controls['twitch'] as FormArray;
            twitch.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>twitch.controls[i]).addControl(f.name, f.control));
            break;
        case 'soundcloud':
            const soundcloud = this.form.controls['soundcloud'] as FormArray;
            soundcloud.push(this.formBuilder.group({}));
            formControlFields.forEach(f => (<FormGroup>soundcloud.controls[i]).addControl(f.name, f.control));
            break;
        }
    }
}
