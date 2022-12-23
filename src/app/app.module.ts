import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavbarComponent } from './components/_shared/navbar/navbar.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UploadersComponent } from './components/uploaders/uploaders.component';
import { ViewerComponent } from './components/viewer/viewer.component';
registerLocaleData(localePt, 'pt-BR');

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        UploadersComponent,
        ReportsComponent,
        ViewerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatAutocompleteModule,
        HttpClientModule,
        FlexLayoutModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatChipsModule
    ],
    exports: [
        MatIconModule,
        MatButtonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatChipsModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
