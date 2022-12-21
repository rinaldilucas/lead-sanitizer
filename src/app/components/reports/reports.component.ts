import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { StateService } from '../services/state.service';
@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
    @ViewChild('medias', { read: MatAutocompleteTrigger }) mediasTrigger!: MatAutocompleteTrigger;
    @ViewChild('services', { read: MatAutocompleteTrigger }) servicesTrigger!: MatAutocompleteTrigger;
    form: FormGroup;

    services!: any[];
    servicesFilteredOptions!: Observable<any[]>;
    medias!: any[];
    mediasFilteredOptions!: Observable<any[]>;

    constructor (
        private formBuilder: FormBuilder,
        private router: Router,
        private stateService: StateService
    ) {
        this.form = this.formBuilder.group({
            user: [null],
            price: [null],
            socialmedias: [null],
            services: [null]
        });
    }

    generateReport () : void {
        console.log(this.form.value);

        const obj = {
            ...this.form.value
        } as any;
        this.stateService.data = obj;
        this.router.navigate(['viewer']);
    }

    ngOnInit (): void {
        this.medias = ['Instagram', 'Facebook', 'Youtube', 'Tiktok', 'Kwai', 'Telegram', 'Spotify', 'Twitter', 'Google', 'Twitch', 'Soundcloud'];
        this.services = ['Curtidas', 'Views', 'Seguidores Premium', 'Seguidores Brasileiros', 'Seguidores Mundiais', 'Reels', 'Comentários', 'Repostagens', 'Plays', 'Tráfego', 'Retweets', 'Membros', 'Horas assistidas', 'Live'];
        this.setAutoCompletes();
    }

    ngAfterViewInit (): void {
        this.mediasTrigger.panelClosingActions.subscribe(() => {
            if (this.mediasTrigger.activeOption) {
                this.form.controls['socialmedias'].setValue(this.mediasTrigger.activeOption.value);
            }
        });
        this.servicesTrigger.panelClosingActions.subscribe(() => {
            if (this.servicesTrigger.activeOption) {
                this.form.controls['services'].setValue(this.servicesTrigger.activeOption.value);
            }
        });
    }

    setAutoCompletes (): void {
        this.mediasFilteredOptions = this.form.controls['socialmedias'].valueChanges.pipe(
            startWith(''),
            map((value) => this._filterMedias(value))
        );
        this.servicesFilteredOptions = this.form.controls['services'].valueChanges.pipe(
            startWith(''),
            map((value) => this._filterServices(value))
        );
    }

    private _filterMedias (value: string): any[] {
        const filterValue = value?.toString().toLowerCase();
        return this.medias.filter((option) => option.toLowerCase().includes(filterValue));
    }

    private _filterServices (value: string): any[] {
        const filterValue = value?.toString().toLowerCase();
        return this.services.filter((option) => option.toLowerCase().includes(filterValue));
    }
}
