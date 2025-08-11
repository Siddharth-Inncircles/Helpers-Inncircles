import { Routes } from '@angular/router';
import { HelpersDisplayComponent } from './components/helpers-display/helpers-display.component';
import { HelperFormComponent } from './components/helper-form/helper-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HelperEditComponent } from './components/helper-edit/helper-edit.component';
export const routes: Routes = [
    {path:'', component: HelpersDisplayComponent},
    {path: 'add-helper', component: HelperFormComponent},
    {path: 'edit-helper', component: HelperEditComponent},
    { path: '**', component: NotFoundComponent },
];
