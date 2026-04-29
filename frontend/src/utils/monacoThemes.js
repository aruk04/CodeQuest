export const draculaTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '282a36' },
    { token: 'comment', foreground: '6272a4' },
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'constant', foreground: 'bd93f9' },
    { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
    { token: 'variable', foreground: '50fa7b' },
  ],
  colors: {
    'editor.background': '#282a36',
    'editor.foreground': '#f8f8f2',
    'editorLineNumber.foreground': '#6272a4',
  }
}

export const monokaiTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '272822' },
    { token: 'comment', foreground: '75715e' },
    { token: 'string', foreground: 'e6db74' },
    { token: 'constant', foreground: 'ae81ff' },
    { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' },
    { token: 'variable', foreground: 'a6e22e' },
  ],
  colors: {
    'editor.background': '#272822',
    'editor.foreground': '#f8f8f2',
    'editorLineNumber.foreground': '#75715e',
  }
}

export const synthwaveTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '2b213a' },
    { token: 'comment', foreground: '6d77b3' },
    { token: 'string', foreground: 'ff8b39' },
    { token: 'constant', foreground: 'f92aad' },
    { token: 'keyword', foreground: 'f92aad', fontStyle: 'bold' },
    { token: 'variable', foreground: '36f9f6' },
  ],
  colors: {
    'editor.background': '#2b213a',
    'editor.foreground': '#f8f8f2',
    'editorLineNumber.foreground': '#6d77b3',
  }
}

export function defineMonacoThemes(monaco) {
  monaco.editor.defineTheme('dracula', draculaTheme)
  monaco.editor.defineTheme('monokai', monokaiTheme)
  monaco.editor.defineTheme('synthwave', synthwaveTheme)
}
