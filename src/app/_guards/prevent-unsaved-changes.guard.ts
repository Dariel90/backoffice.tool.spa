import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { SourceEditComponent } from '../mysources/source-edit/source-edit.component';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<SourceEditComponent> {
  constructor(private alertify: AlertifyService) {}
    canDeactivate(component: SourceEditComponent) {
    if (component.editForm.dirty) {
      return confirm('Are you sure you want to continue? Any usaved changes will be lost');
    }
    return true;
}


}
