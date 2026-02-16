import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patients: Patient[] = [];

  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  patients$ = this.patientsSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('patients');
    if (stored) {
      this.patients = JSON.parse(stored);
      this.patientsSubject.next(this.patients);
    }
  }

  private updateState() {
    localStorage.setItem('patients', JSON.stringify(this.patients));
    this.patientsSubject.next([...this.patients]);
  }

  addPatient(patient: Patient) {
    const newPatient = { ...patient, id: Date.now() };
    this.patients.push(newPatient);
    this.updateState();
  }

  moveToTreatment(id: number) {
    this.patients = this.patients.map(p => {
      if (p.status === 'Current Patient') {
        return { ...p, status: 'Treated', treatedAt: new Date().toISOString() };
      }

      if (p.id === id) {
        return { ...p, status: 'Current Patient' };
      }

      return p;
    });

    this.updateState();
  }

  arriveToClinic(id: number) {
    this.patients = this.patients.map(p =>
      p.id === id
        ? { ...p, status: 'Waiting', arrivedAt: new Date().toISOString() }
        : p
    );
    this.updateState();
  }

  cancelBooking(id: number) {
    this.patients = this.patients.filter(p => p.id !== id);
    this.updateState();

  }
  finishTreatment(id: number) {
    this.patients = this.patients.map(p =>
      p.id === id
        ? { ...p, status: 'Treated', treatedAt: new Date().toISOString() }
        : p
    );
    this.updateState();
  }
}
