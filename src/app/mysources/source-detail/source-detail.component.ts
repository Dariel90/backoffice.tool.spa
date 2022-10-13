import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Source } from 'src/app/_models/source';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { SourceService } from 'src/app/_services/source.service';

@Component({
  selector: 'app-source-detail',
  templateUrl: './source-detail.component.html',
  styleUrls: ['./source-detail.component.css']
})
export class SourceDetailComponent implements OnInit {
  protected source: Source;
  constructor(private sourceService: SourceService, private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.source = data['source'];
    });
  }

}
