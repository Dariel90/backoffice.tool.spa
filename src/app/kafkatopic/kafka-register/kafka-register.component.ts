import { Component, HostListener, OnInit, ViewChild,ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddUpdateMessage } from 'src/app/_models/addUpdateMessage';
import { SourceTopicDetails } from 'src/app/_models/sourceTopicDetails';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';
import { TopicService } from 'src/app/_services/topic.service';

@Component({
  selector: 'app-kafka-register',
  templateUrl: './kafka-register.component.html',
  styleUrls: ['./kafka-register.component.css']
})
export class KafkaRegisterComponent implements OnInit {

  @ViewChild("inputName") inputName : ElementRef;
  @ViewChild('editForm', {static: true} ) editForm: NgForm;
  kafkaTopic: SourceTopicDetails  = {
    id: 0,
    sourceId: 0,
    topicName: ''
  };
  existKafkaTopicConfigured: boolean = false;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  
  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private authService: AuthService, private topicService: TopicService) { }

  ngOnInit(): void {    
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      if(data['kafkatopic']){
        this.kafkaTopic = {
          id: data['kafkatopic'].id,
          sourceId: data['kafkatopic'].sourceId,
          topicName: data['kafkatopic'].topicName,   
        }
        this.existKafkaTopicConfigured = true;
      }else{
        this.kafkaTopic.sourceId = this.authService.getSourceFromStorage();
      }
      
    });
  }

  addOrUpdateKafkaTopic() {
    this.topicService.addOrUpdateKafkaTopic(this.kafkaTopic).subscribe( (next: any) => {
      this.alertify.success(!this.existKafkaTopicConfigured ? `Kafaka Topic added successfully` : `Kafaka Topic updated successfully`);
      this.editForm.reset(this.kafkaTopic);      
      this.existKafkaTopicConfigured = true;
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

}
