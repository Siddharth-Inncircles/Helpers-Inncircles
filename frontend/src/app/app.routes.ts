import { Routes } from '@angular/router';
import { HelpersDisplayComponent } from './components/helpers-display/helpers-display.component';
import { HelperFormComponent } from './components/helper-form/helper-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
export const routes: Routes = [
    {path:'', component: HelpersDisplayComponent},
    {path: 'add-helper', component: HelperFormComponent},
    { path: '**', component: NotFoundComponent },
];
