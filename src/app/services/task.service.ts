import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      map(todos => todos.slice(0, 20).map(todo => ({
        id: todo.id,
        title: todo.title,
        description: `Description for task ${todo.id}`,
        completed: todo.completed,
        dueDate: this.generateRandomFutureDate()
      } as Task)))
    ).subscribe(tasks => {
      this.tasksSubject.next(tasks);
    });
  }
  
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }
  
  addTask(task: Omit<Task, 'id'>): void {
    const currentTasks = this.tasksSubject.getValue();
    const newTask = {
      ...task,
      id: Math.max(...currentTasks.map(t => t.id), 0) + 1
    };
    
    this.tasksSubject.next([...currentTasks, newTask]);
  }
  
  updateTask(task: Task): void {
    const currentTasks = this.tasksSubject.getValue();
    const index = currentTasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      const updatedTasks = [...currentTasks];
      updatedTasks[index] = task;
      this.tasksSubject.next(updatedTasks);
    }
  }
  
  deleteTask(id: number): void {
    const currentTasks = this.tasksSubject.getValue();
    this.tasksSubject.next(currentTasks.filter(task => task.id !== id));
  }
  
  toggleTaskCompletion(id: number): void {
    const currentTasks = this.tasksSubject.getValue();
    const index = currentTasks.findIndex(t => t.id === id);
    
    if (index !== -1) {
      const updatedTasks = [...currentTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        completed: !updatedTasks[index].completed
      };
      this.tasksSubject.next(updatedTasks);
    }
  }
  
  getIncompleteTasksCount(): Observable<number> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => !task.completed).length)
    );
  }
  
  private generateRandomFutureDate(): Date {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
    return futureDate;
  }
}
