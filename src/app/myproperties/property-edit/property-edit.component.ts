import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddUpdateProperty } from 'src/app/_models/addUpdateProperty';
import { Message, MessageData } from 'src/app/_models/message';
import { Property } from 'src/app/_models/property';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';
import { PropertyService } from 'src/app/_services/property.service';

@Component({
  selector: 'app-property-edit',
  templateUrl: './property-edit.component.html',
  styleUrls: ['./property-edit.component.css'],
})
export class PropertyEditComponent implements OnInit {
  @ViewChild('inputName') inputName: ElementRef;
  registerForm: FormGroup = this.formBuilder.group({
    name: [
      { value: '', disabled: false },
      [Validators.required, this.validateName()],
    ],
    datatype: ['', [Validators.required]],
    message: ['', [Validators.required]],
    sysMessage: ['', [Validators.required]],
    sysProperty: ['', [Validators.required]],
  });
  editProperty: AddUpdateProperty = {
    propertyId: 0,
    name: '',
    type: 0,
    messageId: -1,
    isYours: true,
    myPropertyId: -1,
  };

  systemProperties: Property[];
  sourceId: number | null;
  messages: Message[];
  systemMessages: Message[];
  systemMessage: MessageData = {
    id: -1,
    description: '',
    kafkaTopic: '',
    kafkaTopicId: 0,
    name: '',
    sourceId: null,
    sourceName: '',
  };
  submitted = false;

  dataTypes = [
    { value: 0, display: 'Integer' },
    { value: 1, display: 'Float' },
    { value: 2, display: 'Double' },
    { value: 3, display: 'String' },
    { value: 4, display: 'Decimal' },
    { value: 5, display: 'Boolean' },
    { value: 6, display: 'DateTime' },
  ];
  isAnEditionOfAnExternalProperty: boolean;
  forbiddenPropertyNames: string[];

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private propertyService: PropertyService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.forbiddenPropertyNames = [];
    this.route.data.subscribe((data) => {
      // tslint:disable-next-line: no-string-literal
      this.editProperty = {
        propertyId: data['property'].id,
        name: data['property'].name,
        type: data['property'].type,
        messageId: data['property'].messageId,
        isYours: data['property'].isYours,
        myPropertyId: data['property'].myPropertyId,
      };
    });

    this.sourceId = this.authService.getSourceFromStorage();

    this.isAnEditionOfAnExternalProperty =
      this.editProperty.myPropertyId != null && this.sourceId != null;

    this.messageService.getAllMessages(this.sourceId).subscribe((res) => {
      this.messages = res;
    });
    if (this.isAnEditionOfAnExternalProperty) {
      this.messageService
        .getMessageFromProperty(this.editProperty.myPropertyId as number)
        .subscribe((res) => {
          this.systemMessage = res;
          this.loadSystemProperties(this.systemMessage.id);
          this.loadForbbidenProperties(this.editProperty.messageId);
          this.initilizeFormGroup();
        });
    }
    this.messageService.getAllMessages(null).subscribe((res) => {
      this.systemMessages = res;
    });

    this.applyCondionalValidators();
  }

  private initilizeFormGroup() {
    this.registerForm = this.formBuilder.group({
      name: [
        { value: this.editProperty.name, disabled: false },
        [Validators.required, this.validateName()],
      ],
      datatype: [this.editProperty.type, [Validators.required]],
      message: [this.editProperty.messageId, [Validators.required]],
      sysMessage: [
        this.isAnEditionOfAnExternalProperty ? this.systemMessage.id : '',
        [Validators.required],
      ],
      sysProperty: [
        this.isAnEditionOfAnExternalProperty
          ? this.editProperty.myPropertyId
          : '',
        [Validators.required],
      ],
    });
  }

  private applyCondionalValidators() {
    if (!this.isAnEditionOfAnExternalProperty) {
      this.registerForm.get('sysMessage')!.clearValidators();
      this.registerForm.get('sysProperty')!.clearValidators();
      this.registerForm.get('sysMessage')!.updateValueAndValidity();
      this.registerForm.get('sysProperty')!.updateValueAndValidity();
    }
  }

  private validateName(): ValidatorFn | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (this.forbiddenPropertyNames) {
        if (this.forbiddenPropertyNames.length > 0) {
          var iter = 0;
          var stop = false;
          while (iter < this.forbiddenPropertyNames.length && !stop) {
            if (this.forbiddenPropertyNames[iter] === control.value) {
              stop = true;
              return { nameIsForbidden: true };
            } else {
              iter++;
            }
          }
        }
      }
      return null;
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    var formValues = JSON.stringify(this.registerForm.value, null, 2);
    this.addOrUpdateProperty(formValues);
  }

  loadSystemMessageProperties(e: any) {
    if (e.target.value != '') {
      const systemMessageId = e.target.value as number;
      this.loadSystemProperties(systemMessageId);
    } else {
      this.systemProperties = [];
    }
  }

  private loadSystemProperties(systemMessageId: number) {
    this.propertyService
      .getMessageProperties(false, systemMessageId)
      .subscribe((res) => {
        this.systemProperties = res;
      });
  }

  loadForbbidenPropertiesNames(e: any) {
    const messageId = e.target.value as number;
    if(messageId as any != "")
      this.loadForbbidenProperties(messageId);
  }

  loadForbbidenProperties(messageId: number) {
    this.propertyService
      .getMessageProperties(true, messageId)
      .subscribe((res) => {
        this.forbiddenPropertyNames = res.map((x) => x.name);
      });
  }

  private addOrUpdateProperty(formValues: string) {
    const formParam = JSON.parse(formValues) as any;
    this.editProperty = {
      isYours: true,
      messageId: formParam.message,
      name: formParam.name,
      type: formParam.datatype,
      myPropertyId: formParam.sysProperty,
      propertyId: this.editProperty.propertyId,
    };
    this.propertyService.addOrUpdateMessage(this.editProperty).subscribe(
      (next: any) => {
        this.alertify.success('Property upadated successfully');
      },
      (error: string) => {
        this.alertify.error(error);
      }
    );
  }

  getTypeByNumber(type: number) {
    switch (type) {
      case 0:
        return 'Integer';
      case 1:
        return 'Float';
      case 2:
        return 'Double';
      case 3:
        return 'String';
      case 4:
        return 'Decimal';
      case 5:
        return 'Boolean';
      case 6:
        return 'DateTime';
      default:
        return '';
        break;
    }
  }
}
