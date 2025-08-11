import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { TaskService } from '../Serices/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Serices/auth.service';
import { UpdateTaskDto } from '../models/updateTaskDto';

interface taskDetails {
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

interface User {
    id: number;
    username:string;
    Role:string;
}

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html'
})
export class TaskTableComponent implements OnInit { 
  isModalOpen = false;
  taskForm: FormGroup;
  UpdateTaskForm:FormGroup;
  paramsSubscription?: Subscription;
  currentPage = 1;
  pageSize = 5;
  paginatedTasks$ = new BehaviorSubject<taskDetails[]>([]);
  private allTasks: taskDetails[] = [];
  usersList: any[] = [];

 

  constructor(private route: ActivatedRoute, private taskService: TaskService,private fb:FormBuilder,private utb:FormBuilder,private authService:AuthService) {
        this.taskForm = this.fb.group({
          taskName: ['', Validators.required],
          description: [''],
          priority: ['', Validators.required]
        });

        this.UpdateTaskForm = this.utb.group({
          taskid:[''],
          taskName: [''],
          description: [''],
          tskdescription:[''],
          assignedto: ['', Validators.required],
          priority: [''],
          status:[''],
          Due_date :['']
        });
  }

  ngOnInit(): void {
    this.loadUsers();
    console.log(this.usersList);
    this.paramsSubscription= this.route.paramMap.subscribe({
       next:(params)=>{
         const hasReloaded = localStorage.getItem('hasReloaded');
         localStorage.setItem('hasReloaded', 'false');
         
           if(hasReloaded==='false'){
             localStorage.setItem('hasReloaded', 'true');
             window.location.reload();
           }
           this.taskService.getAllTasks().subscribe({
            next:(data)=>{
              this.allTasks=data;
              this.updatePaginatedTasks();
            }
           });  
       }
     })
   }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (res) => {
        this.usersList = res;
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

   updatePaginatedTasks(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pagedTasks = this.allTasks.slice(start, end);
    this.paginatedTasks$.next(pagedTasks);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTasks();
  }

  get totalPages(): number {
    return Math.ceil(this.allTasks.length / this.pageSize);
  }
  
  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  gotoTaskDetailModal(task: taskDetails){ 
    this.isModalOpen=true;
    console.log('this is loading after click update',task);
    this.UpdateTaskForm.patchValue({
      taskid:task.taskid,
      taskName: task.taskName,
      description: task.description,
      priority: task.priority,
      status:task.status,
      Due_date:task.due_date
      // Add other fields if necessary
    });

    this.UpdateTaskForm.get('taskName')?.disable();
    this.UpdateTaskForm.get('description')?.disable();
  }
  
  UpdateTask() {
  if (this.UpdateTaskForm.valid) {
    const updateTask = this.UpdateTaskForm.getRawValue();
    const taskId = updateTask.taskid;
    const now = new Date().toISOString();

    const updateData: UpdateTaskDto = {
    TaskName: updateTask.taskName,
    Description: updateTask.description,
    Priority: updateTask.priority,
    Status: updateTask.status,
    Due_date: updateTask.Due_date ? new Date(updateTask.Due_date).toISOString().split('T')[0] : null,
    Completed_date: updateTask.status === 'Completed' ? new Date().toISOString().split('T')[0] : null,
    lastmodifiedby: Number(localStorage.getItem('UserId')) || 0,
    lastmodifiedtimestamp: new Date().toISOString(),
    actiontaken: updateTask.tskdescription,
    updatedby: Number(localStorage.getItem('UserId')) || 0,
    newstatus: updateTask.status,
    assignedto: updateTask.assignedto ||Number(localStorage.getItem('UserId')) || 0,
    updatedon: new Date().toISOString(),
    Comments: updateTask.tskdescription
    };


    console.log(updateData);

  this.authService.updateTask(taskId, updateData).subscribe({
    next: (response) => {
      this.closeModal();
      window.location.reload();
    },
    error: (err) => {
      console.error('Update failed:', err);
      if (err.error && err.error.errors) {
        console.error('Validation errors:', err.error.errors);
      }
    }
  });

  }
}


  closeModal(){
    this.isModalOpen = false;
    this.taskForm.reset();
    this.UpdateTaskForm.reset();
  }
  
  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 3; // Middle pages (excluding 1 and last)
  
    const pages: (number | string)[] = [];
  
    // Always show first page
    pages.push(1);
  
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);
  
    if (start > 2) {
      pages.push('...');
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    if (end < total - 1) {
      pages.push('...');
    }
  
    // Always show last page
    if (total > 1) {
      pages.push(total);
    }
  
    return pages;
  }
  
  statusClass(status: string): string {
    const base = 'text-xs font-medium px-2 py-1 rounded';
    switch (status) {
      case 'In Progress': return base + ' bg-indigo-700';
      case 'Completed': return base + ' bg-green-500';
      case 'Open': return base + ' bg-gray-400';
      default: return base + ' bg-gray-300';
    }
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'bg-yellow-400';
      case 'Medium': return 'bg-green-400';
      case 'Low': return 'bg-lime-400';
      default: return 'bg-gray-300';
    }
  }
}
