import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BookingType } from '../../models/patient.model';

@Component({
  selector: 'app-add-patient',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
})

export class AddPatientComponent implements OnInit {
  patientForm!: FormGroup;
  isSubmitting = false;
  BookingType = BookingType;

  @Output() formSubmitted = new EventEmitter<boolean>();
  private bookingTypeSub?: Subscription;

  private fb = inject(FormBuilder)
  private patientService = inject(PatientService);

  constructor() { }

  ngOnInit(): void {
    const now = new Date().toISOString().slice(0, 16);

    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[\u0600-\u06FFa-zA-Z]+(\s+[\u0600-\u06FFa-zA-Z]+)*$/)]],
      phone: ['', [Validators.required, Validators.pattern('^09[0-9]{8}$')]],
      bloodType: ['', Validators.required],
      bookingType: [BookingType.Scheduled, Validators.required],
      bookingDate: [now, [Validators.required]]
    });

    this.bookingTypeSub = this.patientForm.get('bookingType')!.valueChanges.subscribe(type => {
      const dateCtrl = this.patientForm.get('bookingDate');

      if (type !== BookingType.Scheduled) {
        dateCtrl?.disable();
        dateCtrl?.setValue(new Date().toISOString().slice(0, 16));
      } else {
        dateCtrl?.enable();
        dateCtrl?.setValue(new Date().toISOString().slice(0, 16));
      }
    });

  }
  get bookingType() {
    return this.patientForm.get('bookingType')?.value;
  }

  get minDateTime() {
    return new Date().toISOString().slice(0, 16);
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting = true;

      setTimeout(() => {
        const now = new Date().toISOString();
        const status = (this.patientForm.value.bookingType === BookingType.Scheduled) ? 'Coming' : 'Waiting';
        const arrivedAt = status === 'Waiting' ? now : undefined;

        this.patientService.addPatient({
          ...this.patientForm.getRawValue(),
          status,
          arrivedAt
        });

        this.patientForm.reset({ bookingType: BookingType.Scheduled, bookingDate: new Date().toISOString().slice(0, 16) });
        this.isSubmitting = false;

        this.formSubmitted.emit(true);
      }, 400);

    }
  }

  onPhoneInput(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.patientForm.get('phone')?.setValue(event.target.value, { emitEvent: false });
  }

  ngOnDestroy() {
    this.bookingTypeSub?.unsubscribe();
  }
}
