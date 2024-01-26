import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditorComponent } from '@hive/editor';


@Component({
  standalone: true,
  imports: [ RouterModule, EditorComponent],
  selector: 'hive-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'question-builder';
}
