/* =============================================================
   MAIN.JS — Hugo Blog
============================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initializeCodeCopyButtons();
  initializeSiteSearch();
  initializeViewToggle();
  initializeHeaderBehavior();
  initializeSearchToggle();
  initializeMobileNav();
  initializeDropdowns();
  initializeReadingProgress();
  initializeTocActiveTracking();
});

/* ── Reading Progress Bar ──────────────────────────────── */
function initializeReadingProgress() {
  var bar = document.getElementById('reading-progress');
  if (!bar) return;

  // only show on article/post pages
  var article = document.querySelector('.article-content');
  if (!article) { bar.style.display = 'none'; return; }

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var progress = Math.min(scrollTop / docHeight, 1);
    bar.style.transform = 'scaleX(' + progress + ')';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ── Header Scroll Shadow ──────────────────────────────── */
function initializeHeaderBehavior() {
  var shell = document.getElementById('site-header');
  if (!shell) return;

  function onScroll() {
    if (window.scrollY > 8) {
      shell.classList.add('header-shell--scrolled');
    } else {
      shell.classList.remove('header-shell--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Search Toggle & Command Palette Modal ─────────────── */
function initializeSearchToggle() {
  var toggleBtn = document.getElementById('search-toggle-btn');
  var modal = document.getElementById('search-modal');
  var backdrop = document.getElementById('search-modal-backdrop');
  var closeBtn = document.getElementById('search-modal-close');
  var modalInput = document.getElementById('search-modal-input');
  var modalResults = document.getElementById('search-modal-results');
  var modalStatus = document.getElementById('search-modal-status');

  if (!modal) return;

  var searchIndex = [];
  var indexLoadingPromise = null;
  var timer = null;
  var activeResultIndex = -1;

  function loadIndex() {
    if (indexLoadingPromise) return indexLoadingPromise;
    indexLoadingPromise = fetch('/index.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { searchIndex = Array.isArray(data) ? data : []; return searchIndex; })
      .catch(function () { searchIndex = []; return []; });
    return indexLoadingPromise;
  }

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('search-toggle--active');
    }
    loadIndex();
    if (modalInput) {
      window.setTimeout(function () {
        modalInput.focus();
        modalInput.select();
      }, 50);
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('search-toggle--active');
    }
    activeResultIndex = -1;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (modal.hidden) openModal(); else closeModal();
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K & Escape)
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.hidden) openModal(); else closeModal();
    } else if (e.key === 'Escape' && !modal.hidden) {
      e.preventDefault();
      closeModal();
    }
  });

  // Modal Instant Search
  if (modalInput && modalResults) {
    modalInput.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { runModalSearch(modalInput.value); }, 150);
    });

    modalInput.addEventListener('keydown', function (e) {
      var items = modalResults.querySelectorAll('.search-modal-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeResultIndex = (activeResultIndex + 1) % items.length;
        updateActiveResult(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeResultIndex = (activeResultIndex - 1 + items.length) % items.length;
        updateActiveResult(items);
      } else if (e.key === 'Enter') {
        if (activeResultIndex >= 0 && items[activeResultIndex]) {
          e.preventDefault();
          items[activeResultIndex].click();
        }
      }
    });
  }

  function updateActiveResult(items) {
    items.forEach(function (el, idx) {
      if (idx === activeResultIndex) {
        el.classList.add('search-modal-item--active');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('search-modal-item--active');
      }
    });
  }

  function runModalSearch(query) {
    query = (query || '').trim();
    activeResultIndex = -1;

    if (!query) {
      modalResults.innerHTML = '';
      if (modalStatus) modalStatus.textContent = '';
      return;
    }

    if (modalStatus) modalStatus.textContent = '搜尋中…';

    loadIndex().then(function (idx) {
      var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      var matched = idx.filter(function (item) {
        var haystack = ((item.title || '') + ' ' + (item.content || '') + ' ' + (item.section || '')).toLowerCase();
        return terms.every(function (t) { return haystack.includes(t); });
      }).slice(0, 15);

      modalResults.innerHTML = '';

      if (matched.length === 0) {
        if (modalStatus) modalStatus.textContent = '找不到「' + query + '」相關結果';
        return;
      }

      if (modalStatus) modalStatus.textContent = '找到 ' + matched.length + ' 篇相關文章';

      matched.forEach(function (item) {
        var a = document.createElement('a');
        a.className = 'search-modal-item';
        a.href = item.permalink || item.url || '#';
        var date = item.date ? item.date.substring(0, 10) : '';

        a.innerHTML =
          '<div class="search-modal-item__head">' +
            '<span class="search-modal-item__title">' + escapeHtml(item.title || '無標題') + '</span>' +
            '<span class="search-modal-item__date">' + escapeHtml(date) + '</span>' +
          '</div>' +
          (item.summary ? '<p class="search-modal-item__summary">' + escapeHtml(item.summary.substring(0, 110)) + '…</p>' : '');

        a.addEventListener('click', function () {
          closeModal();
        });

        modalResults.appendChild(a);
      });
    });
  }
}

/* ── Mobile Navigation ─────────────────────────────────── */
function initializeMobileNav() {
  var btn = document.getElementById('mobile-nav-btn');
  var panel = document.getElementById('mobile-nav-panel');
  if (!btn || !panel) return;

  function openMenu() {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('mobile-nav-toggle--open');
    btn.setAttribute('aria-label', '關閉選單');
  }

  function closeMenu() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('mobile-nav-toggle--open');
    btn.setAttribute('aria-label', '開啟選單');
  }

  btn.addEventListener('click', function () {
    if (panel.hidden) { openMenu(); } else { closeMenu(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) {
      closeMenu();
      btn.focus();
    }
  });

  // Close when a nav link is clicked
  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

/* ── Dropdown Toggles ─────────────────────────────────── */
function initializeDropdowns() {
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      var panel = toggle.nextElementSibling;

      // Close other dropdowns
      dropdownToggles.forEach(function (other) {
        if (other !== toggle) {
          other.setAttribute('aria-expanded', 'false');
          if (other.nextElementSibling) other.nextElementSibling.classList.remove('dropdown-panel--open');
        }
      });

      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        if (panel) panel.classList.remove('dropdown-panel--open');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        if (panel) panel.classList.add('dropdown-panel--open');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-nav__item--dropdown')) {
      dropdownToggles.forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        if (toggle.nextElementSibling) toggle.nextElementSibling.classList.remove('dropdown-panel--open');
      });
    }
  });
}

/* ── TOC Active Link Tracking ──────────────────────────── */
function initializeTocActiveTracking() {
  var toc = document.querySelector('.article-toc');
  if (!toc) return;

  var tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
  if (tocLinks.length === 0) return;

  var headings = tocLinks.map(function (link) {
    var id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '60', 10);
  var offset = headerH + 32;

  function getActive() {
    var scrollY = window.scrollY;
    for (var i = headings.length - 1; i >= 0; i--) {
      if (headings[i].getBoundingClientRect().top + scrollY - offset <= scrollY) {
        return i;
      }
    }
    return 0;
  }

  function updateToc() {
    var activeIdx = getActive();
    tocLinks.forEach(function (link, i) {
      if (i === activeIdx) {
        link.classList.add('toc-active');
      } else {
        link.classList.remove('toc-active');
      }
    });
  }

  window.addEventListener('scroll', updateToc, { passive: true });
  updateToc();
}

/* ── Dropdown Menus ────────────────────────────────────── */
function initializeDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
    var panel = toggle.nextElementSibling;
    if (!panel || !panel.classList.contains('dropdown-panel')) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = panel.classList.contains('dropdown-panel--open');
      closeAllDropdowns();
      if (!isOpen) {
        panel.classList.add('dropdown-panel--open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', closeAllDropdowns);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-panel--open').forEach(function (panel) {
    panel.classList.remove('dropdown-panel--open');
    var toggle = panel.previousElementSibling;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
}

/* ── View Toggle (list / grid) ─────────────────────────── */
function initializeViewToggle() {
  var listBtn = document.querySelector('[data-view-btn="list"]');
  var gridBtn = document.querySelector('[data-view-btn="grid"]');
  var container = document.getElementById('blog-main');
  if (!listBtn || !gridBtn || !container) return;

  var storageKey = 'blog-view-mode';
  var savedView = 'list';
  try {
    savedView = localStorage.getItem(storageKey) || 'list';
  } catch (_) {}

  function setView(mode, save) {
    if (mode === 'grid') {
      container.classList.add('blog-main--grid');
      gridBtn.classList.add('view-toggle__btn--active');
      listBtn.classList.remove('view-toggle__btn--active');
    } else {
      container.classList.remove('blog-main--grid');
      listBtn.classList.add('view-toggle__btn--active');
      gridBtn.classList.remove('view-toggle__btn--active');
    }
    if (save) {
      try { localStorage.setItem(storageKey, mode); } catch (_) {}
    }
  }

  listBtn.addEventListener('click', function () { setView('list', true); });
  gridBtn.addEventListener('click', function () { setView('grid', true); });
  setView(savedView, false);
}

/* ── Code Copy Buttons ─────────────────────────────────── */
function initializeCodeCopyButtons() {
  var codeBlocks = document.querySelectorAll('pre > code');
  codeBlocks.forEach(function (code) {
    var pre = code.parentElement;
    if (!pre || pre.dataset.copyReady === 'true') return;
    pre.dataset.copyReady = 'true';
    pre.classList.add('code-block');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-button';
    button.textContent = '複製';

    button.addEventListener('click', async function () {
      var sourceText = code.innerText.replace(/\n$/, '');
      var success = await copyToClipboard(sourceText);
      button.textContent = success ? '✓ 已複製' : '複製失敗';
      window.setTimeout(function () { button.textContent = '複製'; }, 1600);
    });

    pre.appendChild(button);
  });
}

async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) {}
  }
  var helper = document.createElement('textarea');
  helper.value = text;
  helper.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(helper);
  helper.select();
  var ok = document.execCommand('copy');
  document.body.removeChild(helper);
  return ok;
}

/* ── Site Search (search page) ─────────────────────────── */
function initializeSiteSearch() {
  var input = document.querySelector('[data-search-input]');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var historyList = document.getElementById('search-history-list');
  var historyClearButton = document.getElementById('search-history-clear');
  if (!input || !results || !status) return;

  var searchIndex = [];
  var loadingPromise = null;
  var timer = null;
  var historyStorageKey = 'site-search-history';
  var maxHistory = 8;

  function getHistory() {
    try {
      var raw = window.localStorage.getItem(historyStorageKey);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (_) { return []; }
  }

  function saveHistory(term) {
    try {
      var hist = getHistory().filter(function (h) { return h !== term; });
      hist.unshift(term);
      window.localStorage.setItem(historyStorageKey, JSON.stringify(hist.slice(0, maxHistory)));
    } catch (_) {}
  }

  function clearHistory() {
    try { window.localStorage.removeItem(historyStorageKey); } catch (_) {}
    renderHistory();
  }

  function renderHistory() {
    if (!historyList) return;
    var hist = getHistory();
    historyList.innerHTML = '';
    if (hist.length === 0) {
      historyList.innerHTML = '<p class="search-history__empty">暫無搜尋記錄</p>';
      return;
    }
    hist.forEach(function (term) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-history__item';
      btn.textContent = term;
      btn.addEventListener('click', function () {
        input.value = term;
        runSearch(term);
      });
      historyList.appendChild(btn);
    });
  }

  if (historyClearButton) {
    historyClearButton.addEventListener('click', clearHistory);
  }

  function loadIndex() {
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch('/index.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { searchIndex = Array.isArray(data) ? data : []; return searchIndex; })
      .catch(function () { searchIndex = []; return []; });
    return loadingPromise;
  }

  function runSearch(query) {
    query = (query || '').trim();
    if (!query) {
      results.innerHTML = '';
      status.textContent = '';
      renderHistory();
      return;
    }

    status.textContent = '搜尋中…';
    results.innerHTML = '';

    loadIndex().then(function (idx) {
      var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      var matched = idx.filter(function (item) {
        var haystack = ((item.title || '') + ' ' + (item.content || '') + ' ' + (item.tags || '')).toLowerCase();
        return terms.every(function (t) { return haystack.includes(t); });
      }).slice(0, 20);

      if (matched.length === 0) {
        status.textContent = '找不到「' + query + '」相關結果';
        return;
      }
      status.textContent = '找到 ' + matched.length + ' 篇相關文章';
      saveHistory(query);
      renderHistory();

      matched.forEach(function (item) {
        var el = document.createElement('div');
        el.className = 'search-result-item';
        var date = item.date ? item.date.substring(0, 10) : '';
        el.innerHTML =
          '<a class="search-result-item__title" href="' + (item.permalink || item.url || '#') + '">' +
            escapeHtml(item.title || '無標題') +
          '</a>' +
          '<p class="search-result-item__meta">' + escapeHtml(date) + '</p>' +
          (item.summary ? '<p class="search-result-item__summary">' + escapeHtml(item.summary.substring(0, 120)) + '…</p>' : '');
        results.appendChild(el);
      });
    });
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { runSearch(input.value); }, 280);
  });

  // Initial search from URL
  var params = new URLSearchParams(window.location.search);
  var q = params.get('q');
  if (q) {
    input.value = q;
    runSearch(q);
  } else {
    renderHistory();
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Init dropdowns after DOM ready ─────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initializeDropdowns();
});
