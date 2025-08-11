import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Serices/auth.service';
import Swal from 'sweetalert2';

interface RegisterRequest{
  Username:string;
  Email:string;
  Password:string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {

   registerForm :FormGroup;



   constructor(private fb:FormBuilder,private authService:AuthService,private router:Router){
    this.registerForm=this.fb.group({
      Username:['',Validators.required],
      Email:['',[Validators.required,Validators.email]],
      Password:['',[Validators.required,Validators.minLength(5),Validators.maxLength(15)]],
      cfmpassword:['',Validators.required]
    }
    ,{Validators:this.passwordMatchValidator})
  
   }

    passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('Password')?.value;
      const confirmPassword = formGroup.get('cfmpassword')?.value;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };

    register() {
      if (this.registerForm.valid) {
        const regRequest: RegisterRequest = {
        Username: this.registerForm.value.Username,
        Email: this.registerForm.value.Email,
        Password: this.registerForm.value.Password
        };

        this.authService.userRegister(regRequest).subscribe({
        next: (res) => {
          // alert('User registered successfully');
          // this.router.navigate(['/login']);
          Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'User registered successfully',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/login']);
        });
        },
        error: (err) => {
          console.error('Registration failed:', err);
          Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#d33'
        });
        }
        });
      } 
      else {
        this.registerForm.markAllAsTouched();
      }
    }

}
