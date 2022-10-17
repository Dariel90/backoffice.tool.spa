import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-property.relation-edit',
  templateUrl: './property.relation-edit.component.html',
  styleUrls: ['./property.relation-edit.component.css'],
})
export class PropertyRelationEditComponent implements OnInit {
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
  protected editRelationship: AddUpdatePropertyRelationship = {
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
    private route: ActivatedRoute,
    private propertyRelationshipService: PropertyRelationService,
    private alertify: AlertifyService,
    private sourceService: SourceService,
    public formBuilder: FormBuilder,
    private messageService: MessageService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      // tslint:disable-next-line: no-string-literal
      this.editRelationship = {
        myPropertyId:
          data['realationshipData'].dataRelationship.propertyRelationship
            .systemProperty.propertyId,
        relationshipName: data['realationshipData'].relationshipName,
        sourceRelationId: data['realationshipData'].relationshipId,
        sourceXPropId:
          data['realationshipData'].dataRelationship.propertyRelationship
            .propertySourceX.propertyId,
        sourceYPropId:
          data['realationshipData'].dataRelationship.propertyRelationship
            .propertySourceY.propertyId,
        strongestPropId:
          data['realationshipData'].dataRelationship.propertyRelationship
            .sourceStrongestProp?.propertyId,
      };
      this.loadSources();
      this.loadSysMessages(data);
      
    });
  }

  get f() {
    return this.registerForm!.controls;
  }

  cleanInputs() {
    this.editRelationship = {
      myPropertyId: 0,
      relationshipName: '',
      sourceRelationId: 0,
      sourceXPropId: 0,
      sourceYPropId: 0,
      strongestPropId: null,
    };
    this.initilizeFormGroup(null, true);
    this.inputName.nativeElement.focus();
    this.submitted = false;
  }

  loadSources() {
    this.sourceService.getAllSources().subscribe((res) => {
      this.sources = res;
    });
  }

  loadSysMessages(data: any) {
    this.messageService.getAllMessages(null).subscribe((res) => {
      this.systemMessages = res;
      const sysMessageId = data['realationshipData'].dataRelationship.propertyRelationship.systemProperty.propertyMessageId;
      const sourceXId = data['realationshipData'].dataRelationship.sourceXId;
      const sourceYId = data['realationshipData'].dataRelationship.sourceYId;
      const messageSourceXId = data['realationshipData'].dataRelationship.propertyRelationship.propertySourceX.propertyMessageId;
      const messageSourceYId = data['realationshipData'].dataRelationship.propertyRelationship.propertySourceY.propertyMessageId;
      //loadSystemMessageProperties
      this.propertyService
        .getMessageProperties(false, sysMessageId)
        .subscribe((res) => {
          this.systemProperties = res;
        });

      //loadMessageFormSourceX
      this.messageService.getAllMessages(sourceXId).subscribe((res) => {
        this.messagesFromSourceX = res;
        this.selecedSourceXId = sourceXId;
        //loadMessagePropertiesFromSourceX;
        this.propertyService
        .getMessageProperties(true, messageSourceXId)
        .subscribe((res) => {
          this.propertiesFromSourceX = res;
        });
      });

      //loadMessageFormSourceY;
      this.messageService.getAllMessages(sourceYId).subscribe((res) => {
        this.messagesFromSourceY = res;
        //loadMessagePropertiesFromSourceY
        this.propertyService
        .getMessageProperties(true, messageSourceYId)
        .subscribe((res) => {
          this.propertiesFromSourceY = res;
          this.initilizeFormGroup(data, false);
        });
      });
      
    });
  }

  loadSystemMessageProperties(e: any) {
    if (e.target.value != '') {
      const systemMessageId = e.target.value as number;
      this.propertyService
        .getMessageProperties(false, Number(systemMessageId))
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

  private initilizeFormGroup(data: any, cleanInputs: boolean) {
    if (data && !cleanInputs) {
      this.registerForm = this.formBuilder.group({
        relationshipName: [
          {
            value: data['realationshipData'].relationshipName,
            disabled: false,
          },
          [Validators.required],
        ],
        sysMessage: [data['realationshipData'].dataRelationship.propertyRelationship
        .systemProperty.propertyMessageId, [Validators.required]],
        sysProperty: [
          data['realationshipData'].dataRelationship.propertyRelationship
            .systemProperty.propertyId,
          [Validators.required],
        ],
        sourceX: [
          data['realationshipData'].dataRelationship.sourceXId,
          [Validators.required],
        ],
        messageSourceX: [data['realationshipData'].dataRelationship.propertyRelationship
        .propertySourceX.propertyMessageId, [Validators.required]],
        sourceXProp: [
          data['realationshipData'].dataRelationship.propertyRelationship
            .propertySourceX.propertyId,
          [Validators.required],
        ],
        sourceY: [
          data['realationshipData'].dataRelationship.sourceYId,
          [Validators.required],
        ],
        messageSourceY: [data['realationshipData'].dataRelationship.propertyRelationship
        .propertySourceY.propertyMessageId, [Validators.required]],
        sourceYProp: [
          data['realationshipData'].dataRelationship.propertyRelationship
            .propertySourceY.propertyId,
          [Validators.required],
        ],
        strongestProp: data['realationshipData'].dataRelationship
          .propertyRelationship.sourceStrongestProp != null
          ? this.getStrongestPropertyData(            
              data['realationshipData'].dataRelationship.propertyRelationship
              .propertySourceX.propertyId,
              data['realationshipData'].dataRelationship.propertyRelationship
              .propertySourceY.propertyId,
              data['realationshipData'].dataRelationship.propertyRelationship
              .systemProperty.propertyId,
              data['realationshipData'].dataRelationship.propertyRelationship
                .sourceStrongestProp.propertyId
            )
          : 'n',
      });
    } else {
      this.registerForm = this.formBuilder.group({
        relationshipName: [
          { value: '', disabled: false },
          [Validators.required],
        ],
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
  }

  private getStrongestPropertyData(strongestPropId: number, sourceXPropId: number, sourceYPropId: number, systemPropId: number): string{
    var result: string = 'n';
    switch (strongestPropId) {
      case sourceXPropId:
        result = 'x';
        break;
      case sourceYPropId:
        result = 'y';
        break;
      case systemPropId:
        result = 's';
        break;
      default:
        result = 'n'
        break;
    }
    return result;
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
    this.editRelationship = {
      sourceRelationId: this.editRelationship.sourceRelationId,
      myPropertyId: Number(formParam.sysProperty),
      relationshipName: formParam.relationshipName,
      sourceXPropId: Number(formParam.sourceXProp),
      sourceYPropId: Number(formParam.sourceYProp),
      strongestPropId: strongestPropId,
    };
    this.propertyRelationshipService
      .addOrUpdatePropertyRelationship(this.editRelationship)
      .subscribe(
        (next: any) => {
          this.alertify.success('Relation updated successfully');
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

export type Event = {
  target: {
    value: string
  }
}
