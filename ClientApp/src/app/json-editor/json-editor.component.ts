import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'json-editor',
  standalone: true,
  imports: [],
  template: `
    <div #editorContainer class="editor-container"></div>
    <button (click)="submit()">Submit</button>
    @if (errorMessage) {
      <div class="error-message">
        {{ errorMessage }}
      </div>
    }
  `,
  styleUrl: './json-editor.component.scss'
})
export class JsonEditorComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  editorInstance!: monaco.editor.IStandaloneCodeEditor;
  errorMessage = '';

  // Initial JSON value with a token example

  initialValue = '{\n  "example": "{C}"\n}';

  ngAfterViewInit(): void {
    // Create the Monaco editor instance inside the container
    this.editorInstance = monaco.editor.create(this.editorContainer.nativeElement, {
      value: this.initialValue,
      language: 'json',
      theme: 'vs-light',
      automaticLayout: true, // auto-resizes on container changes
      minimap: { enabled: false }
    });

    // Register a custom completion provider for token suggestions
    monaco.languages.registerCompletionItemProvider('json', {
      triggerCharacters: ['{'], // Trigger when a "{" is typed
      provideCompletionItems: (model, position) => {
        const suggestions: monaco.languages.CompletionItem[] = [
          {
            label: '{C}',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '{C}',
            documentation: 'Currency token (replace with a value like EUR or USD)'
          },
          {
            label: '{D}',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'D}',
            documentation: 'Date token'
          }
        ] as monaco.languages.CompletionItem[];
        return { suggestions };
      }
    });
  }

  submit(): void {
    // Get the current value from the editor
    const currentValue = this.editorInstance.getValue();
    try {
      // Validate the JSON structure
      const parsed = JSON.parse(currentValue);
      this.errorMessage = '';

      // Example token substitution: replace {C} with 'EUR'
      const processedValue = currentValue.replace(/{C}/g, 'EUR');

      console.log('Valid JSON:', parsed);
      console.log('Processed JSON:', processedValue);
      // Continue with further processing (e.g., sending data to a backend)
    } catch (error) {
      this.errorMessage = 'Invalid JSON format. Please correct it before submitting.';
    }
  }
}
