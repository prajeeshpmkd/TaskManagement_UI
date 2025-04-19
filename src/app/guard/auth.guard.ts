import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router=inject(Router);
  const token=localStorage.getItem('token');
  if(token){
    const isTokenValid=!isTokenExpired(token);

    if(isTokenValid){
      return true;
    }
  }

  localStorage.removeItem('token');
  router.navigate(['/login']);
  return false;

};

const isTokenExpired=(token:string): boolean =>{
  try{
    const payload =JSON.parse(atob(token.split('.')[1]));
    const expiry =payload.exp*1000;
    return expiry<Date.now();
  }
  catch(error){
    return true;
  }
}
