import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  minDate: string;
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', [Validators.required, this.futureDateValidator]],
      completed: [false]
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTaskData(this.taskId);
      }
    });
  }
  
  loadTaskData(id: number): void {
    this.taskService.getTasks().subscribe(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          dueDate: new Date(task.dueDate).toISOString().split('T')[0],
          completed: task.completed
        });
      }
    });
  }
  
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today ? null : { pastDate: true };
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;
      const task: Omit<Task, 'id'> = {
        title: formData.title,
        description: formData.description,
        completed: formData.completed,
        dueDate: new Date(formData.dueDate)
      };
      
      console.log('Form data:', task);
      
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask({ ...task, id: this.taskId });
      } else {
        this.taskService.addTask(task);
      }
      
      // Show success message (this would be better with a toast notification library)
      alert('Task ' + (this.isEditMode ? 'updated' : 'added') + ' successfully!');
      this.router.navigate(['/tasks']);
    } else {
      // Mark all form controls as touched to trigger error messages
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

}
