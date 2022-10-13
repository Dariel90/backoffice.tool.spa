import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PropertyMetadataService } from 'src/app/_services/property-metadata.service';
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AddUpdatePropertyMeta } from 'src/app/_models/addUpdatePropertyMeta';
import { ActivatedRoute } from '@angular/router';
import { AddUpdateProperty } from 'src/app/_models/addUpdateProperty';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { PropertyService } from 'src/app/_services/property.service';
import { Property } from 'src/app/_models/property';

@Component({
  selector: 'app-property.metadata-edit',
  templateUrl: './property.metadata-edit.component.html',
  styleUrls: ['./property.metadata-edit.component.css']
})
export class PropertyMetadataEditComponent implements OnInit {
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  registerForm: FormGroup = this.formBuilder.group({
    name: [{ value: '', disabled: false }, [Validators.required]],
    oldValue: ['', [Validators.required]],
    newValue: ['', [Validators.required]],
    message: ['',[Validators.required]],
    property:  ['',[Validators.required]],
    newDatatype: ['', [Validators.required]],
  });
  editPropertyMeta: AddUpdatePropertyMeta = {
    propertyId: 0,
    propertyMetadataDescriptor: '',
    propertyMetadataId: 0,
    propertyMetaDataValue: '',
    propertyReplaceValue: '',
    propertyReplaceValueDataType: 0,
  };
  editProperty: AddUpdateProperty = {
    propertyId: 0,
    name: '',
    type: -1,
    messageId: -1,
    isYours: true,
    myPropertyId: -1,
  };

  dataTypes = [
    { value: 0, display: 'Integer' },
    { value: 1, display: 'Float' },
    { value: 2, display: 'Double' },
    { value: 3, display: 'String' },
    { value: 4, display: 'Decimal' },
    { value: 5, display: 'Boolean' },
    { value: 6, display: 'DateTime' },
  ];
  type: number = -1;
  sourceId: number | null;
  messages: Message[];  
  properties: Property[];

  submitted = false;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private propertyMetadataService: PropertyMetadataService,
    private alertify: AlertifyService,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private messageService: MessageService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    
    this.sourceId = this.authService.getSourceFromStorage();
    this.route.data.subscribe((data) => {
      // tslint:disable-next-line: no-string-literal
      this.editPropertyMeta = {
        propertyId: data['metdata'].property.propertyId,
        propertyMetadataDescriptor: data['metdata'].propertyMetadata.propertyMetadataDescriptor,
        propertyMetadataId: data['metdata'].propertyMetadata.propertyMetadataId,
        propertyMetaDataValue: data['metdata'].propertyMetadata.propertyMetaDataValue,
        propertyReplaceValue: data['metdata'].propertyMetadata.propertyReplaceValue,
        propertyReplaceValueDataType: data['metdata'].propertyMetadata.propertyReplaceValueDataType,
      };
      this.messageService.getAllMessages(this.sourceId).subscribe((res) => {
        this.messages = res;
        this.propertyService
        const messageId: number = Number(data['metdata'].property.propertyMessageId);
        this.propertyService.getMessageProperties(true, messageId)
        .subscribe((res) => {
          this.properties = res;
          this.initilizeFormGroup(messageId);
        });
        
      });
    });
    
  }

  updateDataTypeSelected(e: any) {
    const selectEl = Number(e.target.value);
    this.type = selectEl as number;
    if (this.type >= 0 && this.editProperty.type >= 0) {
      if (this.type != this.editProperty.type) {
        this.registerForm.controls['newDatatype'].setErrors({'typeIsForbidden': true});
      } else {
        this.registerForm.controls['property'].setErrors({'typeIsForbidden': null});
        this.registerForm.controls['newDatatype'].setErrors({'typeIsForbidden': null});
        this.registerForm.controls['property'].updateValueAndValidity();
        this.registerForm.controls['newDatatype'].updateValueAndValidity();
      }
    }
  }

  updateBasePropType(e: any){
    const selectEl = e.target;
    const attrVal:number = selectEl.options[selectEl.selectedIndex].getAttribute('type') as number;
    this.editProperty.type = Number(attrVal);
    if( this.type >= 0 && this.editProperty.type >= 0){
      if(this.type != this.editProperty.type){
        this.registerForm.controls['property'].setErrors({'typeIsForbidden': true});
      }else{
        this.registerForm.controls['property'].setErrors({'typeIsForbidden': null});
        this.registerForm.controls['newDatatype'].setErrors({'typeIsForbidden': null});
        this.registerForm.controls['property'].updateValueAndValidity();
        this.registerForm.controls['newDatatype'].updateValueAndValidity();
      }
    }
  }

  private initilizeFormGroup(messageId: number) {
    this.registerForm = this.formBuilder.group({
      name: [{ value: this.editPropertyMeta.propertyMetadataDescriptor, disabled: false }, [Validators.required]],
      oldValue: [this.editPropertyMeta.propertyMetaDataValue, [Validators.required]],
      newValue: [this.editPropertyMeta.propertyReplaceValue, [Validators.required]],
      message: [messageId,[Validators.required]],
      property:  [this.editPropertyMeta.propertyId,[Validators.required]],
      newDatatype: [this.editPropertyMeta.propertyReplaceValueDataType, [Validators.required]],
    });
  }

  loadMessageProperties(e: any) {
    if (e.target.value != '') {
      const messageId: number = Number(e.target.value) as number;
      this.propertyService
        .getMessageProperties(true, messageId)
        .subscribe((res) => {
          this.properties = res;
        });
    } else {
      this.properties = [];
    }
  }

  get f() {
    return this.registerForm!.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    var formValues = JSON.stringify(this.registerForm.value, null, 2);
    this.addOrUpdateMetadataProperty(formValues);
  }

  

  addOrUpdateMetadataProperty(formValues: string) {
    const formParam = JSON.parse(formValues) as any;
    this.editPropertyMeta = {
      propertyId: Number(formParam.property),
      propertyMetadataDescriptor: formParam.name,
      propertyMetadataId: this.editPropertyMeta.propertyMetadataId,
      propertyMetaDataValue: formParam.oldValue,
      propertyReplaceValue: formParam.newValue,
      propertyReplaceValueDataType: Number(formParam.newDatatype),
    };
    this.propertyMetadataService
      .addOrUpdatePropertyMetadata(this.editPropertyMeta)
      .subscribe(
        (next: any) => {
          this.alertify.success('Metadata updated successfully');
          this.cleanInputs();
        },
        (error: string) => {
          this.alertify.error(error);
        }
      );
  }

  cleanInputs() {
    this.editPropertyMeta = {
      propertyId: 0,
      propertyMetadataDescriptor: '',
      propertyMetadataId: 0,
      propertyMetaDataValue: '',
      propertyReplaceValue: '',
      propertyReplaceValueDataType: 0,
    };
    this.registerForm = this.formBuilder.group({
      name: [{ value: '', disabled: false }, [Validators.required]],
      oldValue: ['', [Validators.required]],
      newValue: ['', [Validators.required]],
      message: ['',[Validators.required]],
      property:  ['',[Validators.required]],
      newDatatype: ['', [Validators.required]],
    });
    this.inputName.nativeElement.focus();
    this.submitted = false;
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
