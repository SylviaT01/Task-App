import { Injectable } from '@angular/core';
import { TaskService } from './task.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private taskService: TaskService) {}
  
  getIncompleteTasksCount(): Observable<number> {
    return this.taskService.getIncompleteTasksCount();
  }
}