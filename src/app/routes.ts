import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { SourceEditComponent } from './mysources/source-edit/source-edit.component';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { SourceEditResolver } from './_resolver/source-edit.resolver';
import { PropertyListComponent } from './myproperties/property-list/property-list.component';
import { PropertyListResolver } from './_resolver/property-list.resolver';
import { SourceDetailComponent } from './mysources/source-detail/source-detail.component';
export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
          { path: 'properties', component: PropertyListComponent, resolve: { users: PropertyListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'source/:id', component: SourceDetailComponent, resolve: { user: SourceEditResolver}, data: { roles: ['Admin', 'SourceAdmin']}},
          { path: 'source/edit', component: SourceEditComponent, resolve: { user: SourceEditResolver}, canDeactivate: [PreventUnsavedChanges], data: { roles: ['Admin', 'SourceAdmin']}},
        ]
      },
    { path: '**', redirectTo: '', pathMatch: 'full' },
  ];