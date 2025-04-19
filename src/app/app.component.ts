import { Component } from '@angular/core';
import { AuthService } from './Serices/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TaskManagement_UI';

  constructor (public authService:AuthService){}
}
