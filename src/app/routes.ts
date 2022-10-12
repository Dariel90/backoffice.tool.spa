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
import { MessageAddComponent } from './mymessage/message-add/message-add.component';
import { MessageEditComponent } from './mymessage/message-edit/message-edit.component';
import { MessageEditResolver } from './_resolver/message-edit.resolver';
import { KafkaRegisterComponent } from './kafkatopic/kafka-register/kafka-register.component';
import { KafkaTopicResolver } from './_resolver/kafkatopic-resolver.resolver';
import { PropertyAddComponent } from './myproperties/property-add/property-add.component';
import { PropertyEditComponent } from './myproperties/property-edit/property-edit.component';
import { PropertyEditResolver } from './_resolver/property-edit.resolver';
import { PropertyMetadataListComponent } from './myproperties/property.metadata-list/property.metadata-list.component';
import { PropertiesMetadataListResolver } from './_resolver/property.metadatas-list.resolver';
import { PropertyMetadataAddComponent } from './myproperties/property.metadata-add/property.metadata-add.component';
import { PropertyMetadataEditComponent } from './myproperties/property.metadata-edit/property.metadata-edit.component';
import { PropertyMetadataEditResolver } from './_resolver/property.metadatas-edit.resolver';
export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
          { path: 'messages', component: MessageListComponent, resolve: { messages: MessageListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'property/:id/edit', component: PropertyEditComponent, resolve: { property: PropertyEditResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'property/add', component: PropertyAddComponent, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'properties', component: PropertyListComponent, resolve: { properties: PropertyListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'properties/metadatas', component: PropertyMetadataListComponent, resolve: { properties: PropertiesMetadataListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'metadata/add', component: PropertyMetadataAddComponent, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'metadata/:id/edit', component: PropertyMetadataEditComponent, resolve: { metdata: PropertyMetadataEditResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'kafkatopic', component: KafkaRegisterComponent, resolve: { kafkatopic: KafkaTopicResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'message/add', component: MessageAddComponent, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'message/:id/edit', component: MessageEditComponent, resolve: { message: MessageEditResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'properties', component: PropertyListComponent, resolve: { properties: PropertyListResolver}, data: { roles: ['Admin', 'SourceAdmin']} },
          { path: 'source/:id', component: SourceDetailComponent, resolve: { source: SourceDetailsResolver}, data: { roles: ['Admin', 'SourceAdmin']}},
          { path: 'source/:id/edit', component: SourceEditComponent, resolve: { source: SourceEditResolver}, canDeactivate: [PreventUnsavedChanges<SourceEditComponent>], data: { roles: ['Admin', 'SourceAdmin']}},
        ]
      },
    { path: '**', redirectTo: '', pathMatch: 'full' },
  ];