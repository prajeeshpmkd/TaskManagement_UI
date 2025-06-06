import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UpdateTaskDto } from '../models/updateTaskDto';

interface LoginRequest{
  Username:string;
  password: string;
}

interface LoginResponse{
  id:number;
  Username : string;
  password: string;
  token : string;
}

interface TaskDto{

  TaskName:string;
  Description: string;
  Priority: string;
  Creationtimestamp: Date;
  createdby: number

}

interface TaskDetails{
  taskid: number;
  taskName: string;
  description: string;
  status: string;
  priority: string;
  Due_date: Date;
  completed_date: string;
  creationtimestamp: string;
  createdby: number;
}

interface User{
    id: number;
    Username:string;
    Role:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl=environment.apiBaseUrl+'/login';
  constructor(private http:HttpClient) { }
  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  login(credentials:LoginRequest):Observable<LoginResponse>{
      return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/login`,credentials);
  }



  saveToken(token:string ,UserId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('UserId',UserId);
  }

  SaveNewTask(tasks:TaskDto): Observable<any>{
    tasks.Creationtimestamp=new Date();
    tasks.createdby=Number(localStorage.getItem('UserId'))||0;
     return this.http.post(`${environment.apiBaseUrl}/api/Tasks/NewTask`,tasks);
  }

    getAllTasks():Observable<TaskDetails[]>{
      return this.http.get<TaskDetails[]>(`${environment.apiBaseUrl}/api/Tasks/GetAllTasks`);
    }

    getAllUsers():Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiBaseUrl}/api/Auth/Users`);
    }

    updateTask(taskId: number,updateData: UpdateTaskDto): Observable<any>{
      //  updateData.lastmodifiedby=Number(localStorage.getItem('UserId'))||0;
      //  updateData.updatedby=Number(localStorage.getItem('UserId'))||0;
      //  updateData.lastmodifiedtimestamp=String(new Date());

       return this.http.put(`${environment.apiBaseUrl}/api/Tasks/${taskId}`, updateData);  

    }


}
