import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaRegisterComponent } from './kafka-register.component';

describe('KafkaRegisterComponent', () => {
  let component: KafkaRegisterComponent;
  let fixture: ComponentFixture<KafkaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KafkaRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KafkaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
