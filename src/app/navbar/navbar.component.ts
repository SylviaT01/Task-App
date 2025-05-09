import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  incompleteCount$: Observable<number>;
  isMenuOpen = false;
  
  constructor(private notificationService: NotificationService) {
    this.incompleteCount$ = this.notificationService.getIncompleteTasksCount();
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
