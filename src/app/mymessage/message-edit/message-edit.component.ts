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
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {

  @ViewChild("inputName") inputName : ElementRef;
  @ViewChild('editForm', {static: true} ) editForm: NgForm;
  message: AddUpdateMessage  = {
    name: '',
    description: '',
    kafkaTopicId: 0,
    kafkaTopic: '',
    messageId : 0,       
    sourceId: 0,
    messageProperties: []
  };
  sourceTopic: SourceTopicDetails;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  
  constructor(private route: ActivatedRoute, private messageService: MessageService, private alertify: AlertifyService, private authService: AuthService, private topicService: TopicService) { }

  ngOnInit(): void {    
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.message = {
        sourceId: data['message'].sourceId,
        name: data['message'].name,
        description: data['message'].description,
        kafkaTopic: data['message'].kafkaTopic,
        messageId: data['message'].id,
        kafkaTopicId: data['message'].kafkaTopicId,
        messageProperties: data['message'].properties     
      }
    });
  }

  addOrUpdateMessage() {
    this.messageService.addOrUpdateMessage(this.message).subscribe( (next: any) => {
      this.alertify.success('Message updated successfully');
      this.editForm.reset(this.message);
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

  cleanInputs(){
    this.message = {
      name: '',
      description: '',
      kafkaTopicId: this.message.kafkaTopicId,
      kafkaTopic: this.message.kafkaTopic,
      messageId : 0,       
      sourceId: 0,
      messageProperties: []
    };
    this.inputName.nativeElement.focus()
  }

}
