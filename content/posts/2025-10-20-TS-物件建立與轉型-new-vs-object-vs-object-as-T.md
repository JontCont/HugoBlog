+++
image = '/image/20251020_ts_object_cover.jpg'
title = '【前端】TypeScript / JS 物件宣告與轉型差異：new vs {} vs {} as T'
date = '2025-10-20T14:55:00'
slug = '-前端-TS-物件建立與轉型-new-vs-object-vs-object-as-T'
description = '深入探討 TypeScript 與 JavaScript 中物件宣告的各種方式：使用 new 實例化、{} 字面量物件與 {} as T 型態斷言的差異、陷阱與最佳實務。'
categories = ['前端技術', 'TypeScript']
tags = ['TypeScript', 'JavaScript', 'Angular', '前端筆記']
keywords = ['TypeScript', 'new', 'Type Assertion', 'Object Literal']
+++

## 前言

在 Angular、React 或純 TypeScript / JavaScript 開發中，我們經常需要初始化物件或傳遞資料模型 (Data Model)。然而，對於物件的建立方式，初學者或從 OOP 轉過來的開發者常常容易混淆以下三種常見寫法：

1. `const user = new User();`
2. `const user = {};`
3. `const user = {} as User;`

雖然這三種寫法在 TypeScript 的編譯階段可能都不會報錯，但在**記憶體結構**、**原型鏈 (Prototype)**、**預設值**以及**執行期 Runtime 安全性**上卻有著天壤之別。

本篇將詳細解析這三者的運作機制、潛在陷阱與最佳使用時機！

---

## 一、 `new ClassName()` 實例化物件

使用 `new` 關鍵字是傳統物件導向 (OOP) 最標準的實例化方式。

```typescript
class User {
  id: number = 0;
  name: string = 'Guest';

  getDisplayName(): string {
    return `[${this.id}] ${this.name}`;
  }
}

// 使用 new 建立實例
const user = new User();
console.log(user.name);            // 輸出: 'Guest'
console.log(user.getDisplayName()); // 輸出: '[0] Guest'
```

### 特點與優勢：
- **完整的原型鏈 (Prototype Chain)**：實例會連結至 `User.prototype`，可以正確調用類別中定義的方法（如 `getDisplayName()`）。
- **屬性初始化 (Constructor & Default Values)**：會執行 `constructor` 構造函式與類別屬性的預設賦值。
- **類型檢查完整**：TypeScript 編譯器與 JS 執行期 `instanceof User` 檢查皆回傳 `true`。

---

## 二、 `{}` 物件字面量 (Object Literal)

`{}` 是 JavaScript 最原生的純資料物件 (Plain Object) 建立方式。

```typescript
// 建立純資料物件
const user = {
  id: 1,
  name: 'Alice'
};

console.log(user.name); // 輸出: 'Alice'
```

### 特點與優勢：
- **輕量與高效**：沒有自訂類別建構子的額外開銷，原型直接指向 `Object.prototype`。
- **適合與 Interface (介面) 搭配**：在 TypeScript 中，如果只是定義資料結構，通常會宣告 `interface` 並搭配字面量：

```typescript
interface IUser {
  id: number;
  name: string;
}

const user: IUser = { id: 1, name: 'Alice' }; // 語法嚴謹，缺少屬性會引發 TS 編譯錯誤
```

---

## 三、 `{} as T` (型態斷言 Type Assertion) 及其隱患

`as` 是 TypeScript 的**型態斷言 (Type Assertion)** 語法。當我們寫 `const user = {} as User;` 時，本質上是在告訴 TS 編譯器：「**請相信我，這個空物件就是 User 型別，不要報錯！**」

```typescript
class User {
  id: number = 0;
  name: string = 'Guest';

  getDisplayName(): string {
    return `[${this.id}] ${this.name}`;
  }
}

// ⚠️ 潛在危險寫法
const user = {} as User;

console.log(user.id); // 輸出: undefined (期待是 0，但實際上並未初始化！)
console.log(user.getDisplayName()); // 💥 執行期崩潰！Uncaught TypeError: user.getDisplayName is not a function
```

### 為什麼 `{} as T` 是危險的陷阱？
1. **只在編譯期生效，執行期沒有任何保護**：`as` 在編譯成 JavaScript 後會完全消失，在 JS 執行期它依然只是一個空的 `{}`。
2. **缺乏屬性初始化**：所有在 Class 內部設定的預設值都不會存在，讀取屬性只會得到 `undefined`。
3. **失去原型方法**：因為沒有通過 `new` 建構，物件無法調用 Class 的任何方法，會引發著名的 `TypeError: ... is not a function` 崩潰。

---

## 四、 三者核心差異對比表

| 特性 / 比較項目 | `new User()` | `{}` (Object Literal) | `{}` as User |
| :--- | :--- | :--- | :--- |
| **建立本質** | 呼叫 Class 建構子 | 建立原生 Plain Object | 空物件假裝成 User 型別 |
| **Prototype 原型鏈** | 指向 `User.prototype` | 指向 `Object.prototype` | 指向 `Object.prototype` (無 User 方法) |
| **預設屬性初始化** | ✅ 會正確賦予預設值 | N/A (需在字面量中自行填寫) | ❌ 屬性全為 `undefined` |
| **可否調用 Class 方法** | ✅ 可以 | ❌ 不可以 | ❌ 執行期拋出 TypeError |
| **TypeScript 編譯檢查** | 嚴格檢查參數與結構 | 嚴格檢查缺少欄位 | ❌ 繞過編譯檢查 (靜默隱患) |
| **使用情境** | 包含業務邏輯/方法的類別 | 純資料結構傳遞 (DTO / API) | 極少數單元測試 Mock 特殊情境 |

---

## 五、 實務建議與最佳做法 (Best Practices)

### 1. 如果只是 API 資料結構，優先使用 `interface` + `{}` 物件字面量
```typescript
interface UserDto {
  id: number;
  name: string;
}

// 正確做法：TS 會強制要求補齊 id 與 name
const user: UserDto = {
  id: 101,
  name: 'Bob'
};
```

### 2. 如果包含邏輯或預設值，使用 `class` + `new`
```typescript
const user = new User();
```

### 3. 如果需要漸進式建構大物件，使用 `Partial<T>` 代替 `{} as T`
```typescript
// 比 {} as User 更安全的過渡方案
const userDraft: Partial<UserDto> = {};
userDraft.id = 1;
userDraft.name = 'Charlie';

// 完成填寫後轉回完整型別
const finalUser = userDraft as UserDto;
```

---

## 結論

在 TypeScript 開發中，**盡量避免隨意使用 `{} as T` 繞過型態檢查**。

- 需使用方法與原型邏輯：用 **`new Class()`**。
- 純資料傳遞與結構限制：用 **`interface` / `type` 配合物件字面量 `{}`**。
- 理解三者的背後原理，能幫你避免無數次線上環境的 `TypeError: undefined is not a function` 異常！
