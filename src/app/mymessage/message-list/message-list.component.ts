import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/_models/message';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { MessageService } from 'src/app/_services/message.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TopicService } from 'src/app/_services/topic.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private messageService: MessageService, private alertify: AlertifyService, private route: ActivatedRoute, private authService: AuthService, private topicService: TopicService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.loadMessages();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.loadMessages();
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.pagination.currentPage, this.pagination.itemsPerPage,).subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

  showEditMessageForm(message: Message) {
    
  }

  showAddMessageForm() {
    

  }

  // saveMessage() {
  //   if (this.isNewMessage) {
  //     // add a new message
  //     const addUpdateMessage: AddUpdateMessage = {
  //       sourceId: this.authService.getSourceFromStorage(),
  //       name: this.newMessage.name,
  //       description: this.newMessage.description,
  //       kafkaTopicId: this.sourceTopic.id,
  //       messageId : 0,
  //       messageProperties: []
  //     }
  //     this.messageService.addOrUpdateMessage(addUpdateMessage).subscribe( next => {
  //       this.alertify.success('User updated successfully');
  //       this.editForm.reset(addUpdateMessage);
  //     }, error => {
  //       this.alertify.error(error);
  //     });;
  //   }
  //   this.messageForm = false;
  // }

  // updateMessage() {
  //   this.messageService.addOrUpdateMessage(this.editedMessage).subscribe( next => {
  //     this.alertify.success('User updated successfully');
  //     this.editForm.reset(this.editedMessage);
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  //   this.editMessageForm = false;
  //   this.editedMessage = {};
  // }

  removeMessage(messageId: number) {
     this.messageService.deleteMessage(messageId);
  }

  // cancelEdits() {
  //   this.editedMessage = {};
  //   this.editMessageForm = false;
  // }

  // cancelNewMessage() {
  //   this.newMessage = {};
  //   this.messageForm = false;
  // }

}
