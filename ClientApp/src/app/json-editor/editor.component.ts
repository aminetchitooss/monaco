import { Component } from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { registerCustomCompletionProvider } from '../monaco-init';

// declare var monaco: any;

@Component({
  selector: 'editor',
  standalone: true,
  imports: [EditorComponent, FormsModule],
  template: `
    <ngx-monaco-editor [(ngModel)]="code" [options]="editorOptions" (onInit)="onEditorInit($event)" style="height: 400px; display: block;" />

    <button (click)="submit()">Submit</button>
  `,
  styleUrl: './json-editor.component.scss'
})
export class JsonEditorV2Component {
  code: string = '{\n  "example": "{C}"\n}';
  errorMessage = '';
  editorOptions = {
    theme: 'vs-light',
    language: 'json',
    automaticLayout: true,
    minimap: { enabled: false }
  };

  onEditorInit(editor: any) {
    console.log('Monaco Editor initialized:', editor);
    // Register the custom completion provider
    registerCustomCompletionProvider();
  }

  submit() {
    try {
      // Validate the JSON structure.
      const parsed = JSON.parse(this.code);
      this.errorMessage = '';

      // Example token substitution logic:
      // Replace {C} with a desired value (e.g., "EUR")
      let processedJson = this.code.replace(/{C}/g, 'EUR');

      console.log('Valid JSON:', parsed);
      console.log('Processed JSON:', processedJson);
      // Proceed with further processing, e.g. sending to a backend.
    } catch (e) {
      this.errorMessage = 'Invalid JSON format. Please correct it before submitting.';
    }
  }
}
