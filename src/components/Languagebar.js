import React from 'react';

const languages = [
    { key: 'javascript', label: 'JavaScript' },
  { key: 'cpp', label: 'C++' },
  { key: 'java', label: 'Java' },
  { key: 'python', label: 'Python' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'css', label: 'CSS' },
  { key: 'html', label: 'HTML' },
  {key: 'text', label: 'Text'},
  { key: 'csharp', label: 'C#' },
  { key: 'c', label: 'C' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'rust', label: 'Rust' },
  { key: 'kotlin', label: 'Kotlin' },
  { key: 'swift', label: 'Swift' },
  { key: 'sql', label: 'SQL' },
];

export default function LanguageBar({ setLanguage }) {
  return (
    <div className="language-bar">
      {languages.map(lang => (
        <button key={lang.key} className={`language-item ${
      lang.label === 'Text' ? 'bg-black text-white' : ''
    }`} onClick={() => setLanguage(lang.key)}>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
