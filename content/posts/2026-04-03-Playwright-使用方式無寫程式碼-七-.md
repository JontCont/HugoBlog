+++
title = 'Playwright 自動化腳本無寫程式碼使用方式 (七) - 生命週期 Hook'
date = '2026-04-03T15:00:00'
slug = 'Playwright-使用方式無寫程式碼-七-'
url = '/2026/04/03/Playwright-使用方式無寫程式碼-七-/'
description = '透過待辦清單範例，完整展示 Playwright 的 beforeAll、beforeEach、afterEach、afterAll 生命週期 Hook 的用途與執行順序。'
categories = ['DevOps', 'Playwright']
tags = ['Playwright']
keywords = ['Playwright', 'lifecycle', 'beforeAll', 'beforeEach', 'afterEach', 'afterAll']
image = '/image/20240720_23-44-39.png'
+++

## 前言

寫測試寫到一定程度，會發現每個測試都在重複做一樣的前置作業（開頁面、登入、清資料），或是測試結束後需要截圖、清理環境。Playwright 提供了一組**生命週期 Hook**，讓你把這些重複的邏輯抽出來，統一管理。

這篇用一個「待辦清單」的情境，完整展示每個 Hook 的用途與執行順序 📝

---

## 一、生命週期全貌

```
>>>> Global Setup（全域設定）
  >>> beforeAll    → 登入帳號（所有測試共用，只做一次）
    >>> beforeEach → 導航頁面 + 清空待辦（每個測試前執行）
      >>> test 1   → 新增待辦事項
    >>> afterEach  → 截圖紀錄（每個測試後執行）
    >>> beforeEach → 導航頁面 + 清空待辦
      >>> test 2   → 勾選完成待辦
    >>> afterEach  → 截圖紀錄
    >>> beforeEach → 導航頁面 + 清空待辦
      >>> test 3   → 刪除待辦事項
    >>> afterEach  → 截圖紀錄
  >>> afterAll     → 登出帳號（收尾清理）
>>>> Global Teardown（全域清理）
```

---

## 二、四個 Hook 的用途

| Hook | 用途 | 執行次數 |
|------|------|---------|
| `beforeAll` | 一次性初始化（登入、建立資料、取得 Token） | 1 次 |
| `beforeEach` | 每個測試前重設狀態（導航頁面、清空資料） | 每個測試各 1 次 |
| `afterEach` | 每個測試後清理/紀錄（截圖、記錄日誌） | 每個測試各 1 次 |
| `afterAll` | 最終收尾（登出、刪除測試帳號、關閉連線） | 1 次 |

---

## 三、完整範例

以下用「待辦清單」頁面展示所有 Hook 的實際寫法：

### 1. beforeAll — 登入帳號（只做一次）

```ts
test.beforeAll(async ({ browser }) => {
  console.log('>>> [beforeAll] 開始：登入帳號');
  const page = await browser.newPage();
  await page.goto(BASE_URL);
  await page.getByLabel('帳號').fill('測試員');
  await page.getByLabel('密碼').fill('1234');
  await page.getByRole('button', { name: '登入' }).click();
  await expect(page.locator('#userInfo')).toContainText('測試員');
  console.log('>>> [beforeAll] 完成：登入成功');
  await page.close();
});
```

> 💡 `beforeAll` 接收的是 `browser` 而非 `page`，因為它的作用域是整個 `describe` 區塊，需要自己建立 page。

### 2. beforeEach — 每個測試前重設狀態

```ts
test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByLabel('帳號').fill('測試員');
  await page.getByLabel('密碼').fill('1234');
  await page.getByRole('button', { name: '登入' }).click();
  await expect(page.locator('#todoSection')).toBeVisible();

  // 清除殘留的待辦事項，確保每個測試從乾淨狀態開始
  await page.getByRole('button', { name: '清除全部' }).click();
  await expect(page.locator('#pendingCount')).toHaveText('0');
});
```

> 💡 `beforeEach` 接收的是 `page`，每個測試會拿到獨立的 page 實例。

### 3. 測試案例 — 搭配 test.step 分段

```ts
test('新增待辦事項', async ({ page }) => {
  await test.step('新增三筆待辦', async () => {
    const items = ['學習 beforeAll', '學習 beforeEach', '學習 afterEach'];
    for (const item of items) {
      await page.getByPlaceholder('輸入待辦事項').fill(item);
      await page.getByRole('button', { name: '新增' }).click();
    }
  });

  await test.step('驗證待辦數量與內容', async () => {
    await expect(page.locator('#todoList li')).toHaveCount(3);
    await expect(page.locator('#pendingCount')).toHaveText('3');
  });
});
```

> 💡 `test.step` 可以把測試拆成有意義的小段落，在報告中會更容易閱讀。

### 4. afterEach — 每個測試後截圖

```ts
test.afterEach(async ({ page }, testInfo) => {
  // 無論成功或失敗都截圖，方便除錯
  await page.screenshot({
    path: `test-results/lifecycle-${testInfo.title}-${testInfo.status}.png`,
  });
});
```

> 💡 `testInfo` 包含測試名稱、狀態（passed/failed）等資訊，可以用來動態命名截圖檔案。

### 5. afterAll — 登出清理

```ts
test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto(BASE_URL);
  await page.getByLabel('帳號').fill('測試員');
  await page.getByLabel('密碼').fill('1234');
  await page.getByRole('button', { name: '登入' }).click();
  await page.getByRole('button', { name: '登出' }).click();
  await expect(page.locator('#loginSection')).toBeVisible();
  await page.close();
});
```

---

## 結論

掌握生命週期 Hook 可以讓測試程式碼更乾淨：

- **重複的前置作業**放 `beforeEach`
- **一次性的初始化**放 `beforeAll`
- **截圖或日誌紀錄**放 `afterEach`
- **收尾清理**放 `afterAll`

這樣每個測試案例就能專注在測試邏輯本身，不用處理環境準備和清理 🚀
