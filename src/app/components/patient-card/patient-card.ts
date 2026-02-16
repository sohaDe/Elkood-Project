import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingType, Patient } from '../../models/patient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-card',
  imports: [CommonModule],
  templateUrl: './patient-card.html',
  styleUrl: './patient-card.css',
})
export class PatientCardComponent {
  BookingType = BookingType;

  @Input() patient!: Patient;
  @Input() mode: 'incoming' | 'waiting' = 'incoming';
  @Output() arrive = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<number>();
  @Output() treat = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<Patient>();


onViewDetails() {
  this.viewDetails.emit(this.patient);
}

  onArrive() {
    this.arrive.emit(this.patient.id);
  }

  onCancel() {
    this.cancel.emit(this.patient.id);
  }

  onTreat() {
    this.treat.emit(this.patient.id);
  }
  get isLate(): boolean {
    return this.patient.status === 'Coming' &&
      new Date(this.patient.bookingDate).getTime() < Date.now();
  }

  get waitingMinutes(): number {
    if (!this.patient.arrivedAt) return 0;

    const diff = Date.now() - new Date(this.patient.arrivedAt).getTime();
    return Math.floor(diff / 60000);
  }

}