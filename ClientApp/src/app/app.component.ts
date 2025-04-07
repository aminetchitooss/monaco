import { Component } from '@angular/core';
import { JsonV3Component } from './json-editor/json-v3.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonV3Component, FormsModule],
  template: `
    <h1>hola</h1>

    <!--    <json-editor />-->
    <h1>Mundo</h1>
    <app-json-editor [(ngModel)]="jsonValue" />
    <button (click)="log()">OIIII</button>
    <!--    <h1>Mundo</h1>-->
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  jsonValue = '{\n  "example": "had ahowa {C}"\n}';

  log() {
    console.log(this.jsonValue);
  }
}
