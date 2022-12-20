
// CORE
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// PAGES
import { ReportsComponent } from './components/reports/reports.component';
import { UploadersComponent } from './components/uploaders/uploaders.component';

const routes: Routes = [
    { path: 'home', component: UploadersComponent },
    { path: 'report', component: ReportsComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', component: UploadersComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
