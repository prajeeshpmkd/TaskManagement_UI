import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Serices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm:FormGroup

  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router)
  {
    this.loginForm=this.fb.group({
      UserName:['',Validators.required],
      password:['',Validators.required]
    })
  }

  login(){
    console.log("Login Starts....");
    console.log(this.loginForm.valid);
    if(this.loginForm.valid){
      console.log("Login begins....");
      this.authService.login(this.loginForm.value).subscribe({
        next:(response)=>{
          console.log("Login response:", response);
          this.authService.saveToken(response.token,response.id.toString());
          this.authService.isLoggedIn();
          console.log(response.token);
          console.log(response.id.toString());
          this.router.navigate(['/dashboard']);
        }
      })
    }

  }
}
