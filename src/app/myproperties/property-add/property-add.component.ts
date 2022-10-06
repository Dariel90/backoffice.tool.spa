import { Component, HostListener, OnInit, ViewChild,ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddUpdateMessage } from 'src/app/_models/addUpdateMessage';
import { AddUpdateProperty } from 'src/app/_models/addUpdateProperty';
import { Message } from 'src/app/_models/message';
import { Property } from 'src/app/_models/property';
import { SourceTopicDetails } from 'src/app/_models/sourceTopicDetails';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';
import { PropertyService } from 'src/app/_services/property.service';
import { TopicService } from 'src/app/_services/topic.service';

@Component({
  selector: 'app-property-add',
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.css']
})
export class PropertyAddComponent implements OnInit {
  @ViewChild("inputName") inputName : ElementRef;
  @ViewChild('editForm', {static: true} ) editForm: NgForm;
  newProperty: AddUpdateProperty  = {
    propertyId: 0,
    name: '',
    type: 0,
    messageId: 0,
    isYours: true,
    myPropertyId: null
  };
  myProperties: Property[];
  sourceId: number | null;
  messages: Message[];
  dataTypes = [{value: 0, display: 'Integer'}, {value: 1, display: 'Float'}, {value: 2, display: 'Double'}, {value: 3, display: 'String'},
  {value: 4, display: 'Decimal'},{value: 5, display: 'Boolean'},{value: 6, display: 'DateTime'}]
  sourceTopic: SourceTopicDetails;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private propertyService: PropertyService, private alertify: AlertifyService, private authService: AuthService, private messageService: MessageService) { 
   
  }

  ngOnInit(): void {
     this.sourceId = this.authService.getSourceFromStorage();
     this.messageService.getAllMessages(this.sourceId).subscribe(res =>{
      this.messages = res;
     });
     this.propertyService.getAllProperties(null,false).subscribe(res =>{
      this.myProperties = res.sort(this.compare);
     });
  }

  compare( a: any, b : any) {
    if ( a.myPropertyName < b.myPropertyName ){
      return -1;
    }
    if ( a.myPropertyName > b.myPropertyName ){
      return 1;
    }
    return 0;
  }

  addOrUpdateProperty(){

  }

  cleanInputs(){
    this.newProperty = {
      propertyId: 0,
      name: '',
      type: 0,
      messageId: 0,
      isYours: true,
      myPropertyId: null
    };
    this.inputName.nativeElement.focus()
  }

}
