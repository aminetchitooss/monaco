import { Component } from '@angular/core';
import { JsonEditorV2Component } from './json-editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonEditorV2Component],
  template: `
    <h1>hola</h1>

    <!--    <json-editor />-->
    <h1>Mundo</h1>
    <editor />
    <!--    <h1>Mundo</h1>-->
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'picto-app';
}
