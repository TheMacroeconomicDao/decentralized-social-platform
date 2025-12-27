// Community Lab by Gybernaty - Text Replacement Script
// Заменяет все упоминания GitLab на Community Lab by Gybernaty

(function() {
  'use strict';
  
  // Функция для замены текста в элементах
  function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      
      // Заменяем различные варианты текста GitLab
      text = text.replace(/GitLab Community Edition/gi, 'Community Lab by Gybernaty');
      text = text.replace(/GitLab CE/gi, 'Community Lab');
      text = text.replace(/GitLab/gi, 'Community Lab');
      text = text.replace(/gitlab\.com/gi, 'gyber.org/lab');
      text = text.replace(/gitlab\.org/gi, 'gyber.org/lab');
      
      if (text !== node.textContent) {
        node.textContent = text;
      }
    } else {
      // Рекурсивно обрабатываем дочерние элементы
      for (let child of node.childNodes) {
        replaceText(child);
      }
    }
  }
  
  // Функция для замены атрибутов
  function replaceAttributes() {
    // Заменяем title страницы
    if (document.title) {
      document.title = document.title.replace(/GitLab/gi, 'Community Lab by Gybernaty');
    }
    
    // Заменяем alt и title атрибуты изображений
    document.querySelectorAll('img[alt*="GitLab"], img[title*="GitLab"]').forEach(img => {
      if (img.alt) img.alt = img.alt.replace(/GitLab/gi, 'Community Lab by Gybernaty');
      if (img.title) img.title = img.title.replace(/GitLab/gi, 'Community Lab by Gybernaty');
    });
    
    // Заменяем placeholder в input полях
    document.querySelectorAll('input[placeholder*="GitLab"]').forEach(input => {
      input.placeholder = input.placeholder.replace(/GitLab/gi, 'Community Lab by Gybernaty');
    });
    
    // Заменяем мета-теги
    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach(meta => {
      if (meta.content) {
        meta.content = meta.content.replace(/GitLab/gi, 'Community Lab by Gybernaty');
      }
    });
  }
  
  // Функция для скрытия логотипа GitLab
  function hideGitLabLogo() {
    // Скрываем изображения с логотипом GitLab
    document.querySelectorAll('img[src*="gitlab"], img[alt*="GitLab"], img[title*="GitLab"]').forEach(img => {
      // Проверяем, не является ли это нашим логотипом
      if (!img.src.includes('lab-logo') && !img.src.includes('gybernaty')) {
        img.style.display = 'none';
        img.style.visibility = 'hidden';
        img.style.opacity = '0';
      }
    });
    
    // Скрываем SVG логотипы GitLab
    document.querySelectorAll('svg[class*="gitlab"], svg[data-name*="GitLab"]').forEach(svg => {
      svg.style.display = 'none';
    });
  }
  
  // Основная функция инициализации
  function init() {
    // Заменяем текст при загрузке страницы
    replaceText(document.body);
    replaceAttributes();
    hideGitLabLogo();
    
    // Используем MutationObserver для отслеживания динамических изменений
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              replaceText(node);
              replaceAttributes();
              hideGitLabLogo();
            }
          });
        }
      });
    });
    
    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // Запускаем при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Также запускаем при полной загрузке страницы
  window.addEventListener('load', function() {
    replaceText(document.body);
    replaceAttributes();
    hideGitLabLogo();
  });
})();

