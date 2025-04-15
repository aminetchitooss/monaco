import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';
import { enforceTyping, registerCustomCompletionProvider } from '../monaco-init';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  template: `
    <div #editorContainer style="width:100%;height:100%;"></div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 500px;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonV3Component),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonV3Component implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef<HTMLDivElement>;
  public value = signal<string>('');
  private editor!: monaco.editor.IStandaloneCodeEditor;

  private ngZone = inject(NgZone);

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.value(),
        language: 'json',
        minimap: { enabled: false },
        automaticLayout: true,
        autoIndent: 'full',
        formatOnType: true,
        formatOnPaste: true
      });
      registerCustomCompletionProvider();
      enforceTyping();

      this.editor.onDidChangeModelContent(() => {
        const newValue = this.editor.getValue();
        this.value.set(newValue);
        this.onChange(newValue);
      });

      this.editor.onDidBlurEditorWidget(() => {
        this.onTouched();
      });
    });
  }

  writeValue(value: string): void {
    this.ngZone.runOutsideAngular(() => {
      if (value !== this.value()) {
        this.value.set(value || '');
        if (this.editor) {
          this.editor.setValue(this.value());
        }
      }
    });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editor) {
      this.editor.updateOptions({ readOnly: isDisabled });
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};
}
interface QueryFormat {
  queries: {
    [key: string]: [string, string[], string[], string, {} | undefined];
  };
  row_based: boolean;
  stream_response: boolean;
  keep_zeroes: boolean;
  disable_nighthawk: boolean;
  max_query_duration: number;
  log_level: string;
  update_tolerance: number;
  column_expression: {
    [key: string]: {};
  };
}
