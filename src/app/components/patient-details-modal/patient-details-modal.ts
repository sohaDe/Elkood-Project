import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-details-modal',
  imports: [CommonModule],
  templateUrl: './patient-details-modal.html',
  styleUrl: './patient-details-modal.css',
})
export class PatientDetailsModalComponent {

  @Input() patient?: Patient;
  @Output() close = new EventEmitter<void>();


  onClose() {
    this.close.emit();
  }
}
