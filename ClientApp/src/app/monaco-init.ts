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

export function enforceTyping() {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: false,
    schemas: [
      {
        uri: 'http://myserver/query-format-schema.json',
        fileMatch: ['*'],
        schema: {
          type: 'object',
          required: ['queries'],
          properties: {
            queries: {
              type: 'object',
              description: 'Mapping from keys to query definitions.',
              additionalProperties: {
                type: 'array',
                description: 'A query definition array: [string, string[], string[], string, object].',
                minItems: 5,
                maxItems: 5
              }
            },
            row_based: {
              type: 'boolean',
              description: 'Indicates if the data is row based.'
            },
            stream_response: {
              type: 'boolean',
              description: 'Enables stream response.'
            },
            keep_zeroes: {
              type: 'boolean',
              description: 'Keeps zero values if set to true.'
            },
            disable_nighthawk: {
              type: 'boolean',
              description: 'Disables nighthawk feature.'
            },
            max_query_duration: {
              type: 'number',
              description: 'Maximum query duration in milliseconds.'
            },
            log_level: {
              type: 'string',
              description: 'The log level setting.'
            },
            update_tolerance: {
              type: 'number',
              description: 'Tolerance value for updates.'
            },
            column_expression: {
              type: 'object',
              description: 'Mapping for column expressions.',
              additionalProperties: {
                type: 'object',
                description: 'An object representing a column expression.'
              }
            }
          },
          additionalProperties: false
        }
      }
    ]
  });
}
