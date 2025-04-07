import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Configure Monaco Environment to use the correct worker files.
// This uses the new URL() syntax to load the worker modules.

// Configure Monaco to load workers from the assets folder.
(window as any).MonacoEnvironment = {
  getWorker: (workerId: string, label: string) => {
    if (label === 'json') {
      return new Worker('assets/monaco-editor/vs/language/json/json.worker.js', { type: 'module' });
    }
    // Fallback to the default editor worker.
    return new Worker('assets/monaco-editor/vs/editor/editor.worker.js', { type: 'module' });
  }
};
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
