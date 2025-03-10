import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddUpdateMessage } from 'src/app/_models/addUpdateMessage';
import { SourceTopicDetails } from 'src/app/_models/sourceTopicDetails';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';
import { TopicService } from 'src/app/_services/topic.service';

@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.css'],
})
export class MessageAddComponent implements OnInit {
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  public newMessage: AddUpdateMessage = {
    name: '',
    description: '',
    kafkaTopicId: 0,
    kafkaTopic: '',
    messageId: 0,
    sourceId: 0,
    messageProperties: [],
  };
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private messageService: MessageService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    const sourceId: number = this.authService.getSourceFromStorage();
    this.topicService.getSourceTopic(sourceId).subscribe(
      (response) => {
        this.newMessage = {
          name: '',
          description: '',
          kafkaTopicId: response.id,
          kafkaTopic: response.topicName,
          messageId: 0,
          sourceId: sourceId,
          messageProperties: [],
        };
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  addOrUpdateMessage() {
    this.messageService.addOrUpdateMessage(this.newMessage).subscribe(
      (next: any) => {
        this.alertify.success('Message created successfully');
        this.editForm.reset(this.newMessage);
      },
      (error: string) => {
        this.alertify.error(error);
      }
    );
  }

  cleanInputs() {
    this.newMessage = {
      name: '',
      description: '',
      kafkaTopicId: this.newMessage.kafkaTopicId,
      kafkaTopic: this.newMessage.kafkaTopic,
      messageId: 0,
      sourceId: 0,
      messageProperties: [],
    };
    this.inputName.nativeElement.focus();
  }
}
