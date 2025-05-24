'use client'

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownRenderer.module.scss';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`${styles.markdownRenderer} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Стилизация заголовков
          h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
          h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
          h5: ({ children }) => <h5 className={styles.h5}>{children}</h5>,
          h6: ({ children }) => <h6 className={styles.h6}>{children}</h6>,
          
          // Стилизация параграфов
          p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
          
          // Стилизация списков
          ul: ({ children }) => <ul className={styles.unorderedList}>{children}</ul>,
          ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
          li: ({ children }) => <li className={styles.listItem}>{children}</li>,
          
          // Стилизация ссылок
          a: ({ href, children }) => (
            <a 
              href={href} 
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Стилизация кода
          code: ({ inline, className, children }) => {
            if (inline) {
              return <code className={styles.inlineCode}>{children}</code>;
            }
            
            const language = className?.replace('language-', '') || '';
            return (
              <div className={styles.codeBlock}>
                {language && (
                  <div className={styles.codeLanguage}>{language}</div>
                )}
                <pre className={styles.pre}>
                  <code className={`${styles.code} ${className || ''}`}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          
          // Стилизация цитат
          blockquote: ({ children }) => (
            <blockquote className={styles.blockquote}>{children}</blockquote>
          ),
          
          // Стилизация таблиц
          table: ({ children }) => (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>{children}</table>
            </div>
          ),
          th: ({ children }) => <th className={styles.tableHeader}>{children}</th>,
          td: ({ children }) => <td className={styles.tableCell}>{children}</td>,
          
          // Стилизация горизонтальной линии
          hr: () => <hr className={styles.divider} />,
          
          // Стилизация выделения текста
          strong: ({ children }) => <strong className={styles.bold}>{children}</strong>,
          em: ({ children }) => <em className={styles.italic}>{children}</em>,
          
          // Стилизация зачеркнутого текста
          del: ({ children }) => <del className={styles.strikethrough}>{children}</del>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}; 