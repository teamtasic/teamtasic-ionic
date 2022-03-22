import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meet, meetTask } from 'src/app/classes/meet';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss'],
})
export class TaskManagerComponent implements OnInit, OnChanges {
  @Input() meet: Meet = Meet.null;
  @Input() showCreateForm: boolean | undefined;
  @Output() meetChange: EventEmitter<Meet> = new EventEmitter<Meet>();

  taskCreationForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    slots: [1, [Validators.min(1)]],
    isTrainerOnly: [false],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}
  ngOnChanges() {}

  addTask() {
    if (this.taskCreationForm.valid) {
      const task: meetTask = {
        title: this.taskCreationForm.get('title')?.value,
        description: this.taskCreationForm.get('description')?.value,
        slots: this.taskCreationForm.get('slots')?.value,
        isTrainerOnly: this.taskCreationForm.get('isTrainerOnly')?.value,
        users: [],
        comments: {},
      };
      this.meet.tasks.push(task);
      console.log('added task', task, this.meet);
      this.meetChange.emit(this.meet);
      this.taskCreationForm.reset();
    }
  }
}
