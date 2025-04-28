
import { Component, OnInit } from '@angular/core';
import { Observable, map, combineLatest } from 'rxjs'; 
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
  paginatedTasks$: Observable<Task[]>;
  filterStatus: string = 'all';
  
 
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pageNumbers: number[] = [];
  startItem = 1;
  endItem = 10;
  totalItems$: Observable<number>;
 
  incompleteTasks$: Observable<number>;
  completedTasks$: Observable<number>;
  
  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
    this.filteredTasks$ = this.tasks$;
    
    this.incompleteTasks$ = this.tasks$.pipe(
      map(tasks => tasks?.filter(task => !task.completed) || []),
      map(tasks => tasks.length)
    );
    
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks?.filter(task => task.completed) || []),
      map(tasks => tasks.length)
    );

   
    this.totalItems$ = this.filteredTasks$.pipe(
      map(tasks => tasks?.length || 0)
    );

    
    this.paginatedTasks$ = combineLatest([this.filteredTasks$, this.totalItems$]).pipe(
      map(([tasks, totalItems]) => {
        this.updatePaginationInfo(totalItems);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return tasks?.slice(startIndex, startIndex + this.pageSize) || [];
      })
    );
  }
  
  ngOnInit(): void {
    this.applyFilter('all');
  }
  
  applyFilter(status: string): void {
    this.filterStatus = status;
    this.currentPage = 1; 
    
    if (status === 'all') {
      this.filteredTasks$ = this.tasks$;
    } else {
      const isCompleted = status === 'completed';
      this.filteredTasks$ = this.tasks$.pipe(
        map((tasks: Task[]) => tasks.filter((task: Task) => task.completed === isCompleted))
      );
    }
    
    this.incompleteTasks$ = this.tasks$.pipe(
      map(tasks => tasks?.filter(task => !task.completed) || []),
      map(tasks => tasks.length)
    );
    
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks?.filter(task => task.completed) || []),
      map(tasks => tasks.length)
    );

   
    this.totalItems$ = this.filteredTasks$.pipe(
      map(tasks => tasks?.length || 0)
    );

   
    this.paginatedTasks$ = combineLatest([this.filteredTasks$, this.totalItems$]).pipe(
      map(([tasks, totalItems]) => {
        this.updatePaginationInfo(totalItems);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return tasks?.slice(startIndex, startIndex + this.pageSize) || [];
      })
    );
  }
  
  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    alert('Task deleted successfully')
  }
  
  toggleTaskCompletion(id: number): void {
    this.taskService.toggleTaskCompletion(id);
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
  
  
  updatePaginationInfo(totalItems: number): void {
    this.totalPages = Math.max(1, Math.ceil(totalItems / this.pageSize));
    this.generatePageNumbers();
    this.startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.currentPage * this.pageSize, totalItems);
  }

  generatePageNumbers(): void {
    this.pageNumbers = [];
    
    
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
      return;
    }
    
   
    this.pageNumbers.push(1);
    
    if (this.currentPage > 3) {
      this.pageNumbers.push(-1); 
    }
    
    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      this.pageNumbers.push(i);
    }
    
    if (this.currentPage < this.totalPages - 2) {
      this.pageNumbers.push(-1); 
    }
    
    if (this.totalPages > 1) {
      this.pageNumbers.push(this.totalPages);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
     
      this.paginatedTasks$ = combineLatest([this.filteredTasks$, this.totalItems$]).pipe(
        map(([tasks, totalItems]) => {
          this.updatePaginationInfo(totalItems);
          const startIndex = (this.currentPage - 1) * this.pageSize;
          return tasks?.slice(startIndex, startIndex + this.pageSize) || [];
        })
      );
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1; 
    this.paginatedTasks$ = combineLatest([this.filteredTasks$, this.totalItems$]).pipe(
      map(([tasks, totalItems]) => {
        this.updatePaginationInfo(totalItems);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return tasks?.slice(startIndex, startIndex + this.pageSize) || [];
      })
    );
  }
}