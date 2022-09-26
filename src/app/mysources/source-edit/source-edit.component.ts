import { AuthService } from './../../_services/auth.service';
import { AlertifyService } from './../../_services/alertify.service';
import { SourceService } from './../../_services/source.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Source } from 'src/app/_models/source';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './source-edit.component.html',
  styleUrls: ['./source-edit.component.css']
})
export class SourceEditComponent implements OnInit {
  @ViewChild('editForm', {static: true} ) editForm: NgForm;
  source: Source;
  photoUrl: string;
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
      // tslint:disable-next-line: no-string-literal
      this.source = data['user'];
    });
  }

  updateSource() {
    this.sourceService.addOrUpdateSource(this.source).subscribe( (next: any) => {
      this.alertify.success('User updated successfully');
      this.editForm.reset(this.source);
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

}
