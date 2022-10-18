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
import { defaultPagination } from 'src/app/_utils/utils';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  protected messages: Message[];
  private pagination: Pagination;
  protected page = defaultPagination.page;
  protected count = defaultPagination.count;
  protected tableSize: number = defaultPagination.tableSize;
  protected tableSizes = defaultPagination.tableSizes;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
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
    this.messageService
      .getPaginatedMessages(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (response: PaginatedResult<Message[]>) => {
          this.messages = response.result;
          this.pagination = response.pagination;
          this.page = response.pagination.currentPage;
          this.count = response.pagination.totalItems;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  showAddMessageForm() {
    this.router.navigate([
      '/message/add',
      this.authService.getSourceFromStorage(),
    ]);
  }

  removeMessage(messageId: number) {
    this.messageService.deleteMessage(messageId).subscribe(
      () => {
        this.alertify.success('Message has been deleted succesfully');
      },
      (error) => {
        this.alertify.error('Failed to delete the message');
      }
    );
  }
}
