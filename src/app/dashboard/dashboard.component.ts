import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Serices/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../Serices/task.service';

interface taskDetails{
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

  isModalOpen = false;
  paramsSubscription?:Subscription;
  taskForm: FormGroup;
  private allTasks: taskDetails[] = [];
  InProgressTasks:number=0;
  CompletedTasks:number=0;
  TotalTasks:number=0;

  constructor(private fb: FormBuilder,private authService:AuthService,route:ActivatedRoute,taskService:TaskService) {

    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      description: [''],
      priority: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getAllTasks().subscribe({
      next:(data)=>{
        this.allTasks=data;
        this.InProgressTasks=data.filter(data=>data.status==='In Progress').length; 
        this.CompletedTasks=data.filter(data=>data.status==='Completed').length; 
        this.TotalTasks=data.length;
        console.log('Total inprogress Tasks=',this.InProgressTasks,'Total completed Tasks=',this.CompletedTasks,'Total Tasks=',this.TotalTasks);
        console.log(data);
      }
     });  
   }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.taskForm.reset();
  }

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
