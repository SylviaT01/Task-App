import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs'; // Import map operator from rxjs
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  filterStatus: string = 'all';
  
  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
    this.filteredTasks$ = this.tasks$;
  }
  
  ngOnInit(): void {
    this.applyFilter('all');
  }
  
  applyFilter(status: string): void {
    this.filterStatus = status;
    if (status === 'all') {
      this.filteredTasks$ = this.tasks$;
    } else {
      const isCompleted = status === 'completed';
      this.filteredTasks$ = this.tasks$.pipe(
        map((tasks: Task[]) => tasks.filter((task: Task) => task.completed === isCompleted))
      );
    }
  }
  
  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }
  
  toggleTaskCompletion(id: number): void {
    this.taskService.toggleTaskCompletion(id);
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}