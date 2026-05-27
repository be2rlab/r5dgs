/* ============================================================
   R5DGS — Project Page Interactions
   Theme toggle (localStorage-persisted), smooth scroll,
   BibTeX copy-to-clipboard.
   ============================================================ */

(function () {
  'use strict';

  /* ----- Theme Toggle ----- */
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;

  const STORAGE_KEY = 'r5dgs-theme';

  // Restore persisted theme
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    html.setAttribute('data-theme', saved);
  } else {
    // Default: respect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ----- Smooth Scroll for Nav Links ----- */
  document.querySelectorAll('nav a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- BibTeX Copy-to-Clipboard ----- */
  const copyBtn = document.getElementById('bibCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const pre   = this.parentElement.querySelector('pre');
      const text  = pre ? pre.textContent : '';

      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showCopied(copyBtn);
        }).catch(function () {
          fallbackCopy(text, copyBtn);
        });
      } else {
        fallbackCopy(text, copyBtn);
      }
    });
  }

  function fallbackCopy(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {
      // silently fail
    }
    document.body.removeChild(textarea);
  }

  function showCopied(btn) {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }

})();
