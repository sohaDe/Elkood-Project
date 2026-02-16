import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BookingType, Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient';
import { CommonModule } from '@angular/common';
import { AddPatientComponent } from '../../components/add-patient/add-patient';
import { HeaderComponent } from '../../components/header/header';
import { PatientCardComponent } from '../../components/patient-card/patient-card';
import { Subject, takeUntil } from 'rxjs';
import { PatientDetailsModalComponent } from '../../components/patient-details-modal/patient-details-modal';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AddPatientComponent, HeaderComponent, PatientCardComponent,  PatientDetailsModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage implements OnInit {
  allPatients: Patient[] = [];
  incomingPatients: Patient[] = [];
  waitingPatients: Patient[] = [];
  treatedPatients: Patient[] = [];

  currentPatient?: Patient;
  selectedPatient?: Patient;
  showForm = false;
  isClosing = false;
  showToast = false;
  toastTimeout: any;

  private destroy$ = new Subject<void>();
  private intervalId: any;

  private patientService = inject(PatientService)
  private cdr = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.patientService.patients$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allPatients = data;
        this.calculatePatients();
      });
    this.intervalId = setInterval(() => {
      this.cdr.detectChanges();
    }, 60000);

  }

  openDetails(patient: Patient) {
  this.selectedPatient = patient;
}


closeDetails() {
  this.selectedPatient = undefined;
}

  showSuccessToast() {
    this.showToast = true;
    clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      console.log('toast hidden:', this.showToast);
      this.showToast = false;

      this.cdr.detectChanges();
    }, 3000);
  }

  toggleForm() {
    if (this.showForm) {
      this.showForm = false;
      this.isClosing = true;

      setTimeout(() => {
        this.isClosing = false;
      }, 600);
    } else {
      this.showForm = true;
    }
  }

  onFormSubmitted(success: boolean) {
    if (success) {
      this.showSuccessToast();
    }
    this.toggleForm();
  }


  constructor() { }

  private calculatePatients() {

    this.incomingPatients = this.allPatients
      .filter(p => p.status === 'Coming')
      .sort((a, b) =>
        new Date(a.bookingDate).getTime() -
        new Date(b.bookingDate).getTime()
      );

    this.waitingPatients = this.allPatients
      .filter(p => p.status === 'Waiting')
      .sort((a, b) => {

        if (a.bookingType === BookingType.Emergency && b.bookingType !== BookingType.Emergency) return -1;
        if (a.bookingType !== BookingType.Emergency && b.bookingType === BookingType.Emergency) return 1;

        if (a.bookingType === BookingType.WalkIn && b.bookingType === BookingType.Scheduled) return -1;
        if (a.bookingType === BookingType.Scheduled && b.bookingType === BookingType.WalkIn) return 1;

        const aTime = a.arrivedAt ? new Date(a.arrivedAt).getTime() : Infinity;
        const bTime = b.arrivedAt ? new Date(b.arrivedAt).getTime() : Infinity;

        return aTime - bTime;
      });

    this.treatedPatients = this.allPatients
      .filter(p => p.status === 'Treated');

    this.currentPatient = this.allPatients
      .find(p => p.status === 'Current Patient');
  }

  onArrive(id: number) { this.patientService.arriveToClinic(id); }
  onTreat(id: number) { this.patientService.moveToTreatment(id); }
  onCancel(id: number) { this.patientService.cancelBooking(id); }

  finishCurrentPatient(id: number) {
    this.patientService.finishTreatment(id);
  }

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.intervalId);
  }

}