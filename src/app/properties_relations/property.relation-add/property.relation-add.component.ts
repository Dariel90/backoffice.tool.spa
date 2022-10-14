import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { AddUpdatePropertyRelationship } from 'src/app/_models/addUpdatePropertyRelationship';
import { Message } from 'src/app/_models/message';
import { Property } from 'src/app/_models/property';
import { Source } from 'src/app/_models/source';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';
import { PropertyRelationService } from 'src/app/_services/property-relation.service';
import { PropertyService } from 'src/app/_services/property.service';
import { SourceService } from 'src/app/_services/source.service';

@Component({
  selector: 'app-property.relation-add',
  templateUrl: './property.relation-add.component.html',
  styleUrls: ['./property.relation-add.component.css'],
})
export class PropertyRelationAddComponent implements OnInit {
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('selectSourceY') selectSourceY: ElementRef;
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  protected registerForm: FormGroup = this.formBuilder.group({
    relationshipName: [{ value: '', disabled: false }, [Validators.required]],
    sysMessage: ['', [Validators.required]],
    sysProperty: ['', [Validators.required]],
    sourceX: ['', [Validators.required]],
    messageSourceX: ['', [Validators.required]],
    sourceXProp: ['', [Validators.required]],
    sourceY: ['', [Validators.required]],
    messageSourceY: ['', [Validators.required]],
    sourceYProp: ['', [Validators.required]],
    strongestProp: ['', [Validators.required]],
  });
  protected newRelationship: AddUpdatePropertyRelationship = {
    myPropertyId: 0,
    relationshipName: '',
    sourceRelationId: 0,
    sourceXPropId: 0,
    sourceYPropId: 0,
    strongestPropId: null,
  };
  protected systemMessages: Message[];
  protected messagesFromSourceX: Message[];
  protected messagesFromSourceY: Message[];

  protected systemProperties: Property[];
  protected propertiesFromSourceX: Property[];
  protected propertiesFromSourceY: Property[];

  protected sources: Source[];
  protected selecedSourceXId: number;

  protected mySysPropType: number = -1;
  protected propTypeFromSourceX: number = -1;
  protected propTypeFromSourceY: number = -1;

  protected submitted = false;

  constructor(
    private propertyRelationshipService: PropertyRelationService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private sourceService: SourceService,
    public formBuilder: FormBuilder,
    private messageService: MessageService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.initilizeFormGroup();
    this.loadSources();
    this.loadSysMessages();
  }

  get f() {
    return this.registerForm!.controls;
  }

  cleanInputs() {
    this.newRelationship = {
      myPropertyId: 0,
      relationshipName: '',
      sourceRelationId: 0,
      sourceXPropId: 0,
      sourceYPropId: 0,
      strongestPropId: null,
    };
    this.initilizeFormGroup();
    this.inputName.nativeElement.focus();
    this.submitted = false;
  }

  loadSources() {
    this.sourceService.getAllSources().subscribe((res) => {
      this.sources = res;
    });
  }

  loadSysMessages() {
    this.messageService.getAllMessages(null).subscribe((res) => {
      this.systemMessages = res;
    });
  }

  loadSystemMessageProperties(e: any) {
    if (e.target.value != '') {
      const systemMessageId = e.target.value as number;
      this.propertyService
        .getMessageProperties(false, systemMessageId)
        .subscribe((res) => {
          this.systemProperties = res;
        });
    } else {
      this.systemProperties = [];
    }
  }

  loadMessageFormSourceX(e: any) {
    if (e.target.value != '') {
      const sourceId: number = Number(e.target.value) as number;
      this.messageService.getAllMessages(sourceId).subscribe((res) => {
        this.messagesFromSourceX = res;
        this.selecedSourceXId = sourceId;
      });
    } else {
      this.messagesFromSourceX = [];
    }
  }

  loadMessageFormSourceY(e: any) {
    if (e.target.value != '') {
      const sourceId: number = Number(e.target.value) as number;
      if (sourceId >= 0 && this.selecedSourceXId >= 0) {
        if (sourceId == this.selecedSourceXId) {
          this.registerForm.controls['sourceY'].setErrors({
            sameSourceIsForbidden: true,
          });
        } else {
          this.registerForm.controls['sourceY'].setErrors({
            sameSourceIsForbidden: null,
          });
          this.registerForm.controls['sourceY'].updateValueAndValidity();
          this.messageService.getAllMessages(sourceId).subscribe((res) => {
            this.messagesFromSourceY = res;
          });
        }
      }
    } else {
      this.messagesFromSourceY = [];
    }
  }

  loadMessagePropertiesFromSourceX(e: any) {
    if (e.target.value != '') {
      const messageId: number = Number(e.target.value) as number;
      this.propertyService
        .getMessageProperties(true, messageId)
        .subscribe((res) => {
          this.propertiesFromSourceX = res;
        });
    } else {
      this.propertiesFromSourceX = [];
    }
  }

  loadMessagePropertiesFromSourceY(e: any) {
    if (e.target.value != '') {
      const messageId: number = Number(e.target.value) as number;
      this.propertyService
        .getMessageProperties(true, messageId)
        .subscribe((res) => {
          this.propertiesFromSourceY = res;
        });
    } else {
      this.propertiesFromSourceY = [];
    }
  }

  updateMySysPropType(e: any) {
    const selectEl = e.target;
    const attrVal: number = selectEl.options[
      selectEl.selectedIndex
    ].getAttribute('type') as number;
    this.mySysPropType = Number(attrVal);
  }

  updatePropTypeFromSourceX(e: any) {
    const selectEl = e.target;
    const attrVal: number = selectEl.options[
      selectEl.selectedIndex
    ].getAttribute('type') as number;
    this.propTypeFromSourceX = Number(attrVal);
    if (this.mySysPropType >= 0) {
      if (this.propTypeFromSourceX != this.mySysPropType) {
        this.alertify.error(
          'You must select a property with the same type as the system property type'
        );
      }
    }
  }

  updatePropTypeFromSourceY(e: any) {
    const selectEl = e.target;
    const attrVal: number = selectEl.options[
      selectEl.selectedIndex
    ].getAttribute('type') as number;
    this.propTypeFromSourceY = Number(attrVal);
    if (this.mySysPropType >= 0) {
      if (this.propTypeFromSourceY != this.mySysPropType) {
        this.alertify.error(
          'You must select a property with the same type as the system property type'
        );
      }
    }
  }

  private initilizeFormGroup() {
    this.registerForm = this.formBuilder.group({
      relationshipName: [{ value: '', disabled: false }, [Validators.required]],
      sysMessage: ['', [Validators.required]],
      sysProperty: ['', [Validators.required]],
      sourceX: ['', [Validators.required]],
      messageSourceX: ['', [Validators.required]],
      sourceXProp: ['', [Validators.required]],
      sourceY: ['', [Validators.required]],
      messageSourceY: ['', [Validators.required]],
      sourceYProp: ['', [Validators.required]],
      strongestProp: ['n'],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    var formValues = JSON.stringify(this.registerForm.value, null, 2);
    this.addOrUpdatePropertyRelationship(formValues);
  }

  addOrUpdatePropertyRelationship(formValues: string) {
    const formParam = JSON.parse(formValues) as any;
    const strongestPropId: number | null =
      formParam.strongestProp == 'x'
        ? Number(formParam.sourceXProp)
        : formParam.strongestProp == 'y'
        ? Number(formParam.sourceYProp)
        : formParam.strongestProp == 's'
        ? Number(formParam.sysProperty)
        : null;
    this.newRelationship = {
      sourceRelationId: 0,
      myPropertyId: Number(formParam.sysProperty),
      relationshipName: formParam.relationshipName,
      sourceXPropId: Number(formParam.sourceXProp),
      sourceYPropId: Number(formParam.sourceYProp),
      strongestPropId: strongestPropId,
    };
    this.propertyRelationshipService
      .addOrUpdatePropertyRelationship(this.newRelationship)
      .subscribe(
        (next: any) => {
          this.alertify.success('Relation created successfully');
          this.cleanInputs();
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
