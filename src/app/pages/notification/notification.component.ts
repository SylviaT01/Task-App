import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  incompleteCount$: Observable<number>;
  
  constructor(private notificationService: NotificationService) {
    this.incompleteCount$ = this.notificationService.getIncompleteTasksCount();
  }

}
