import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AddUpdateProperty } from 'src/app/_models/addUpdateProperty';
import { Message } from 'src/app/_models/message';
import { Property } from 'src/app/_models/property';
import { SourceTopicDetails } from 'src/app/_models/sourceTopicDetails';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';
import { PropertyService } from 'src/app/_services/property.service';
import { numberToTypeMap } from 'src/app/_utils/utils';
import Validation from '../../utils/validation';

@Component({
  selector: 'app-property-add',
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.css'],
})
export class PropertyAddComponent implements OnInit {
  @ViewChild('inputName') inputName: ElementRef;
  protected registerForm: FormGroup;
  protected newProperty: AddUpdateProperty = {
    propertyId: 0,
    name: '',
    type: 0,
    messageId: -1,
    isYours: true,
    myPropertyId: -1,
  };
  protected propType: number = -1;
  protected mySysPropType: number = -1;
  protected systemProperties: Property[];
  protected sourceId: number | null;
  protected messages: Message[];
  protected systemMessages: Message[];
  protected systemMessage: Message = {
    id: -1,
    description: '',
    kafkaTopic: '',
    kafkaTopicId: 0,
    name: '',
    properties: [],
    sourceId: null,
    sourceName: '',
  };
  protected submitted = false;

  protected dataTypes = [
    { value: 0, display: 'Integer' },
    { value: 1, display: 'Float' },
    { value: 2, display: 'Double' },
    { value: 3, display: 'String' },
    { value: 4, display: 'Decimal' },
    { value: 5, display: 'Boolean' },
    { value: 6, display: 'DateTime' },
  ];

  protected forbiddenPropertyNames: string[];

  constructor(
    private propertyService: PropertyService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private messageService: MessageService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.forbiddenPropertyNames = [];
    this.initilizeFormGroup();

    this.sourceId = this.authService.getSourceFromStorage();
    this.messageService.getAllMessages(this.sourceId).subscribe((response) => {
      this.messages = response;
    });
    this.messageService.getAllMessages(null).subscribe((response) => {
      this.systemMessages = response;
    });
  }

  UpdateDataTypeSelected(e: any){
    const selectEl = e.target;
    const attrVal:number = selectEl.options[selectEl.selectedIndex].getAttribute('type') as number;
    this.propType = attrVal as number;
  }

  private validateName(): ValidatorFn | null{
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      if(this.forbiddenPropertyNames!.length > 0){
        var iter = 0;
        var stop = false;
        while(iter < this.forbiddenPropertyNames.length && !stop){
          if(this.forbiddenPropertyNames[iter] === control.value){
            stop = true;
            return {'nameIsForbidden': true};
          }else{
            iter++; 
          }               
        }
      }        
      return null;
    }; 
  }

  get f() {
    return this.registerForm!.controls;
  }

  UpdateMySysPropType(e: any){
    const selectEl = e.target;
    const attrVal:number = selectEl.options[selectEl.selectedIndex].getAttribute('type') as number;
    this.mySysPropType = Number(attrVal);
    const type = Number(this.propType);
    if( type >= 0 && this.mySysPropType >= 0){
      if(type != this.mySysPropType){
        this.registerForm.controls['sysProperty'].setErrors({'typeIsForbidden': true});
      }else{
        this.registerForm.controls['sysProperty'].setErrors({'typeIsForbidden': false});
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    var formValues = JSON.stringify(this.registerForm.value, null, 2);
    var propertyDataType: number = this.f["datatype"].value as number;
    if(propertyDataType !== Number(this.mySysPropType)){
      this.alertify.message("The properties types doesn't match");
      return;
    }
    this.addOrUpdateProperty(formValues);
  }

  loadSystemMessageProperties(e: any) {    
    if(e.target.value != ""){
      const systemMessageId =  e.target.value as number;
      this.propertyService
        .getMessageProperties(false, systemMessageId)
        .subscribe((response) => {
          this.systemProperties = response;
        });
    }else{
      this.systemProperties = []
    }      
  }

  loadForbbidenPropertiesNames(e: any) {
    const messageId = e.target.value as number;
    this.propertyService
      .getMessageProperties(true, messageId)
      .subscribe((response) => {
        this.forbiddenPropertyNames = response.map(x => (x.name));
      });
  }

  private addOrUpdateProperty(formValues: string) {
    const formParam = JSON.parse(formValues) as any;
    this.newProperty = {
      isYours: true,
      messageId: formParam.message,
      name: formParam.name,
      type: formParam.datatype,
      myPropertyId: formParam.sysProperty,
      propertyId: 0
    }
    this.propertyService.addOrUpdateMessage(this.newProperty).subscribe( (next: any) => {
      this.alertify.success('Property created successfully');
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

  private initilizeFormGroup(){
    this.registerForm = this.formBuilder.group({
      name: [{value: '', disabled: false}, [Validators.required, this.validateName()]],
      datatype:  ["", [Validators.required]],
      message:  ["", [Validators.required]],
      sysMessage:  ["", [Validators.required]],
      sysProperty:  ["", [Validators.required]]
    });
  }

  cleanInputs() {
    this.newProperty = {
      propertyId: 0,
      name: '',
      type: 0,
      messageId: 0,
      isYours: true,
      myPropertyId: null,
    };
    this.initilizeFormGroup();
    this.inputName.nativeElement.focus();
  }

  getTypeByNumber(type: number) {
    return numberToTypeMap(type);
  }
}
