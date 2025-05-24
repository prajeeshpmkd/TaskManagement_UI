import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface LoginRequest{
  Username:string;
  password: string;
}

interface LoginResponse{
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
  due_date: string;
  completed_date: string;
  creationtimestamp: string;
  createdby: number;
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

  saveToken(token:string ,Username:string){
    localStorage.setItem('token',token);
    localStorage.setItem('UserId',Username);
  }

  SaveNewTask(tasks:TaskDto): Observable<any>{
    tasks.Creationtimestamp=new Date();
    tasks.createdby=2;
     return this.http.post(`${environment.apiBaseUrl}/api/Tasks/NewTask`,tasks);
  }

    getAllTasks():Observable<TaskDetails[]>{
      return this.http.get<TaskDetails[]>(`${environment.apiBaseUrl}/api/Tasks/GetAllTasks`);
    }
}
