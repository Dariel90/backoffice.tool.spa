import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { SourceEditComponent } from './mysources/source-edit/source-edit.component';
import { PreventUnsavedChanges} from './_guards/prevent-unsaved-changes.guard';
import { SourceEditResolver } from './_resolver/source-edit.resolver';
import { PropertyListComponent } from './myproperties/property-list/property-list.component';
import { PropertyListResolver } from './_resolver/property-list.resolver';
import { SourceDetailComponent } from './mysources/source-detail/source-detail.component';
import { SourceDetailsResolver } from './_resolver/source-detail.resolver';
import { MessageListComponent } from './mymessage/message-list/message-list.component';
import { MessageListResolver } from './_resolver/message-list.resolver';
export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
          { path: 'messages', component: MessageListComponent, resolve: { messages: MessageListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'properties', component: PropertyListComponent, resolve: { properties: PropertyListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'source/:id', component: SourceDetailComponent, resolve: { source: SourceDetailsResolver}, data: { roles: ['Admin', 'SourceAdmin']}},
          { path: 'source/:id/edit', component: SourceEditComponent, resolve: { source: SourceEditResolver}, canDeactivate: [PreventUnsavedChanges<SourceEditComponent>], data: { roles: ['Admin', 'SourceAdmin']}},
        ]
      },
    { path: '**', redirectTo: '', pathMatch: 'full' },
  ];