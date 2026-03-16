import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';



@Component({
  selector: 'app-waste-report',
  imports: [MatDialogModule, MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatLabel, MatSelectModule, ReactiveFormsModule],
  templateUrl: './waste-report.html',
  styleUrl: './waste-report.css',
})
export class WasteReport implements OnInit {
  reportForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      description: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  submitReport() {

  }
}
