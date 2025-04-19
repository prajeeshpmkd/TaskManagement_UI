import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
@Injectable({
  providedIn: 'root'
})
export class TaskService {

    private apiUrl=environment.apiBaseUrl+'/login'; 
    constructor(private http:HttpClient) { }

    getAllTasks():Observable<TaskDetails[]>{
      return this.http.get<TaskDetails[]>(`${environment.apiBaseUrl}/api/Tasks/GetAllTasks`);
    }

    
}
