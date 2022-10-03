import { Component, Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { SourceEditComponent } from '../mysources/source-edit/source-edit.component';
import { MessageListComponent } from '../mymessage/message-list/message-list.component';
import { NgForm } from '@angular/forms';


interface ComponentWithForm {
  editForm: NgForm;
}
@Injectable()
export class PreventUnsavedChanges<T extends ComponentWithForm> implements CanDeactivate<T>{
  constructor(private alertify: AlertifyService) {}
    canDeactivate(component: T) {
      if (component.editForm.dirty) {
        return confirm('Are you sure you want to continue? Any usaved changes will be lost');
      }
      return true;
    }
}
