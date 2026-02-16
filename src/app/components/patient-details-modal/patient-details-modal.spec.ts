import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsModal } from './patient-details-modal';

describe('PatientDetailsModal', () => {
  let component: PatientDetailsModal;
  let fixture: ComponentFixture<PatientDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDetailsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
