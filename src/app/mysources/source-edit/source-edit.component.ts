import { AuthService } from './../../_services/auth.service';
import { AlertifyService } from './../../_services/alertify.service';
import { SourceService } from './../../_services/source.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddUpdateSource } from 'src/app/_models/addUpdateSource';

@Component({
  selector: 'app-member-edit',
  templateUrl: './source-edit.component.html',
  styleUrls: ['./source-edit.component.css']
})
export class SourceEditComponent implements OnInit {
  @ViewChild('editForm', {static: true} ) editForm: NgForm;
  source: AddUpdateSource;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private sourceService: SourceService,
              private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.source = {
        sourceId: data['source'].id,
        name: data['source'].name,
        sourceMessages : [],
        sourceTopics: []        
      }
    });
  }

  addOrUpdateSource() {
    this.sourceService.addOrUpdateSource(this.source).subscribe( (next: any) => {
      this.alertify.success('Source updated successfully');
      this.editForm.reset(this.source);
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

}
