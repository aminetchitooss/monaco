import * as monaco from 'monaco-editor';

let isProviderRegistered = false;

export function registerCustomCompletionProvider() {
  if (isProviderRegistered) {
    return;
  }
  // Use the Monaco instance loaded by ngx-monaco-editor if available.
  const monacoInstance = (window as any).monaco || monaco;
  monacoInstance.languages.registerCompletionItemProvider('json', {
    triggerCharacters: ['{'],
    provideCompletionItems: (model: any, position: any) => {
      const suggestions = [
        {
          label: '{C}',
          kind: monacoInstance.languages.CompletionItemKind.Keyword,
          insertText: 'C}',
          documentation: 'Currency token (replace with EUR, USD, etc.)'
        },
        {
          label: '{D}',
          kind: monacoInstance.languages.CompletionItemKind.Keyword,
          insertText: 'D}',
          documentation: 'Date token'
        }
      ];
      return { suggestions };
    }
  });
  isProviderRegistered = true;
}
