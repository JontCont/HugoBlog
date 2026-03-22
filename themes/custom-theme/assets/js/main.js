document.addEventListener('DOMContentLoaded', function () {
	initializeCodeCopyButtons();
	initializeSiteSearch();
	initializeViewToggle();
});

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
			button.textContent = success ? '已複製' : '複製失敗';
			window.setTimeout(function () {
				button.textContent = '複製';
			}, 1400);
		});

		pre.appendChild(button);
	});
}

async function copyToClipboard(text) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (error) {
			return false;
		}
	}

	var helper = document.createElement('textarea');
	helper.value = text;
	helper.style.position = 'fixed';
	helper.style.opacity = '0';
	document.body.appendChild(helper);
	helper.select();
	var success = document.execCommand('copy');
	document.body.removeChild(helper);
	return success;
}

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
		} catch (error) {
			console.warn('無法讀取搜尋歷史', error);
			return [];
		}
	}

	function saveHistory(history) {
		try {
			window.localStorage.setItem(historyStorageKey, JSON.stringify(history));
		} catch (error) {
			console.warn('無法儲存搜尋歷史', error);
		}
	}

	function addHistory(query) {
		var value = query.trim();
		if (!value) return;
		var history = getHistory().filter(function (item) {
			return item.toLowerCase() !== value.toLowerCase();
		});
		history.unshift(value);
		if (history.length > maxHistory) history = history.slice(0, maxHistory);
		saveHistory(history);
		renderHistory();
	}

	function renderHistory() {
		if (!historyList || !historyClearButton) return;
		var history = getHistory();
		historyList.innerHTML = '';
		historyClearButton.style.display = history.length ? 'inline-flex' : 'none';

		if (!history.length) {
			var empty = document.createElement('p');
			empty.className = 'search-history__empty';
			empty.textContent = '目前沒有搜尋紀錄。';
			historyList.appendChild(empty);
			return;
		}

		history.forEach(function (term) {
			var button = document.createElement('button');
			button.type = 'button';
			button.className = 'search-history__item';
			button.textContent = term;
			button.addEventListener('click', function () {
				input.value = term;
				renderResults(term);
			});
			historyList.appendChild(button);
		});
	}

	function loadIndex() {
		if (loadingPromise) return loadingPromise;
		loadingPromise = fetch('/search/index.json')
			.then(function (response) { return response.ok ? response.json() : []; })
			.then(function (json) {
				searchIndex = Array.isArray(json) ? json : [];
				return searchIndex;
			})
			.catch(function () {
				searchIndex = [];
				return searchIndex;
			});
		return loadingPromise;
	}

	function calculateScore(item, keyword) {
		var score = 0;
		var title = (item.title || '').toLowerCase();
		var summary = (item.summary || '').toLowerCase();
		var content = (item.content || '').toLowerCase();

		if (title.indexOf(keyword) !== -1) score += 10;
		if (summary.indexOf(keyword) !== -1) score += 6;
		if (content.indexOf(keyword) !== -1) score += 2;
		return score;
	}

	function renderResults(query) {
		var keyword = query.trim().toLowerCase();
		if (!keyword) {
			status.textContent = '請輸入關鍵字開始搜尋。';
			results.innerHTML = '';
			updateQueryString('');
			return;
		}

		status.textContent = '搜尋中...';
		loadIndex().then(function (items) {
			var matched = items
				.map(function (item) {
					return {
						item: item,
						score: calculateScore(item, keyword)
					};
				})
				.filter(function (entry) {
					return entry.score > 0;
				})
				.sort(function (a, b) {
					return b.score - a.score;
				})
				.slice(0, 40);

			results.innerHTML = '';

			if (!matched.length) {
				status.textContent = '找不到符合的結果。';
				updateQueryString(query);
				addHistory(query);
				return;
			}

			status.textContent = '找到 ' + matched.length + ' 筆結果';
			matched.forEach(function (entry) {
				var article = document.createElement('article');
				article.className = 'search-result-item';

				var titleLink = document.createElement('a');
				titleLink.href = entry.item.permalink;
				titleLink.className = 'search-result-item__title';
				titleLink.textContent = entry.item.title || '未命名內容';

				var meta = document.createElement('p');
				meta.className = 'search-result-item__meta';
				meta.textContent = [entry.item.section, entry.item.date].filter(Boolean).join(' · ');

				var summary = document.createElement('p');
				summary.className = 'search-result-item__summary';
				summary.textContent = entry.item.summary || '';

				article.appendChild(titleLink);
				article.appendChild(meta);
				article.appendChild(summary);
				results.appendChild(article);
			});

			updateQueryString(query);
			addHistory(query);
		});
	}

	function updateQueryString(query) {
		var url = new URL(window.location.href);
		if (query) {
			url.searchParams.set('q', query);
		} else {
			url.searchParams.delete('q');
		}
		window.history.replaceState({}, '', url.toString());
	}

	input.addEventListener('input', function () {
		window.clearTimeout(timer);
		var value = input.value;
		timer = window.setTimeout(function () {
			renderResults(value);
		}, 200);
	});

	var form = input.closest('form');
	if (form) {
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			renderResults(input.value);
		});
	}

	if (historyClearButton) {
		historyClearButton.addEventListener('click', function () {
			saveHistory([]);
			renderHistory();
		});
	}

	renderHistory();

	var initialQuery = new URLSearchParams(window.location.search).get('q') || '';
	if (initialQuery) {
		input.value = initialQuery;
		renderResults(initialQuery);
	}
}

function initializeViewToggle() {
	var blogMain = document.getElementById('blog-main');
	if (!blogMain) return;

	var COOKIE_KEY = 'blog-view-mode';

	function getCookie(name) {
		var match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
		return match ? decodeURIComponent(match[2]) : null;
	}

	function setCookie(name, value, days) {
		var expires = new Date(Date.now() + days * 864e5).toUTCString();
		document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
	}

	function applyMode(mode) {
		blogMain.classList.toggle('blog-main--grid', mode === 'grid');
		document.querySelectorAll('[data-view-btn]').forEach(function (btn) {
			btn.classList.toggle('view-toggle__btn--active', btn.dataset.viewBtn === mode);
		});
	}

	var savedMode = getCookie(COOKIE_KEY) || 'list';
	applyMode(savedMode);

	document.querySelectorAll('[data-view-btn]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var mode = btn.dataset.viewBtn;
			applyMode(mode);
			setCookie(COOKIE_KEY, mode, 365);
		});
	});
}
