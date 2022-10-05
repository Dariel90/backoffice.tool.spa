import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  tableSize: number = 5;
  tableSizes: any = [5, 10, 50, 100];

  constructor(private router: Router,private messageService: MessageService, private alertify: AlertifyService, private route: ActivatedRoute, private authService: AuthService, private topicService: TopicService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
      this.page = this.pagination.currentPage;
      this.count = this.pagination.totalItems;
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.pagination.currentPage = event;
    this.loadMessages();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.pagination.itemsPerPage = event.target.value;
    this.page = 1;
    this.loadMessages();
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
      this.page = res.pagination.currentPage;
      this.count = res.pagination.totalItems;
    }, error => {
      this.alertify.error(error);
    });
  }

  showAddMessageForm() {
    this.router.navigate(['/message/add',this.authService.getSourceFromStorage()]);

  }

  removeMessage(messageId: number) {
     this.messageService.deleteMessage(messageId);
  }

}
