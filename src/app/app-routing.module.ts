
// CORE
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// PAGES
import { UploadersComponent } from './components/uploaders/uploaders.component';
import { ViewerComponent } from './components/viewer/viewer.component';

const routes: Routes = [
    { path: 'home', component: UploadersComponent },
    { path: 'report', component: ViewerComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', component: UploadersComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
