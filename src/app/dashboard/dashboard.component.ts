import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Serices/auth.service';
import { BehaviorSubject } from 'rxjs';

interface TaskDetails{
  taskid: number;
  taskName: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  completed_date: string;
  creationtimestamp: string;
  createdby: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // Flag to control modal visibility
  isModalOpen = false;

  // Reactive form group for the task modal
  taskForm: FormGroup;


  constructor(private fb: FormBuilder,private authService:AuthService) {
    // Initialize the form with default values and validators
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      description: [''],
      priority: ['', Validators.required]
    });
  }

  // Open modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close modal and reset form
  closeModal() {
    this.isModalOpen = false;
    this.taskForm.reset();
  }

  // Handle form submission
  submitTask() {
    if (this.taskForm.valid) {
      const newTask = this.taskForm.value;
      console.log('Submitted Task:', newTask);
      this.authService.SaveNewTask(this.taskForm.value).subscribe({
        next:(response)=>{
          this.closeModal();
          window.location.reload();
          console.log('Successfully task added');
        }
      })
    }
  }

 
}
