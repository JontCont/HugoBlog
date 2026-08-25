+++
image = '/image/20251115_angular_formgroup_cover.jpg'
title = '【Angular】表單開發解析：為什麼應該使用 FormGroup 而不是自訂 modelData？'
date = '2025-11-15T10:00:00'
slug = 'Angular-為什麼應該使用FormGroup而不是自訂modelData'
description = '在 Angular 表單開發中，探討使用傳統自訂物件 modelData 與使用 FormGroup / Reactive Forms 的本質差異、優缺點分析與實務建議。'
categories = ['前端技術', 'Angular']
tags = ['Angular', 'FormGroup', 'ReactiveForms', '前端筆記']
keywords = ['Angular', 'FormGroup', 'Reactive Forms', 'FormControl', 'ngModel']
+++

## 前言

在 Angular 的表單開發中，不少從 Vue/React 或傳統雙向綁定 (Two-way Data Binding) 轉過來的開發者，習慣在 Component 中定義一個自訂的資料物件（例如 `modelData`），並透過 `[(ngModel)]` 進行綁定：

```typescript
// 傳統常見寫法
modelData = {
  username: '',
  email: '',
  age: null
};
```

這種寫法看似直覺、簡單，但在處理**複雜表單驗證**、**動態欄位**、**非同步校驗**或**響應式資料流**時，往往會寫出大量維護困難的輔助程式碼。

本篇將深入比較自訂 `modelData` 與使用 Angular 官方推薦的 **`FormGroup` (Reactive Forms / 響應式表單)** 的本質差異，並說明為什麼在正式專案中應該優先使用 `FormGroup`。

---

## 一、 常見的傳統寫法：自訂 `modelData`

```typescript
@Component({
  template: `
    <input [(ngModel)]="modelData.username" placeholder="用戶名" />
    <input [(ngModel)]="modelData.email" placeholder="Email" />
    <button (click)="onSubmit()" [disabled]="!isFormValid()">提交</button>
  `
})
export class UserComponent {
  modelData = { username: '', email: '' };

  // 必須手動撰寫驗證邏輯
  isFormValid(): boolean {
    return this.modelData.username.length > 0 && this.modelData.email.includes('@');
  }

  onSubmit() {
    console.log(this.modelData);
  }
}
```

### 缺點：
1. **手動維護表單狀態**：無法自動追蹤使用者是否踩過欄位 (`touched`)、欄位內容是否被修改過 (`dirty`)。
2. **驗證邏輯散落**：驗證邏輯必須寫在 Component 方法或樣板判斷中，隨表單變大會極難維護。
3. **無響應式事件**：無法直接對單一欄位的變化訂閱 RxJS Observable 流。

---

## 二、 什麼是 `FormGroup` (Reactive Forms)？

`FormGroup` 是 Angular 響應式表單的核心架構，它將表單的**模型與狀態**交給 Angular 內建的控制層管理：

```typescript
@Component({
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="username" placeholder="用戶名" />
      <div *ngIf="userForm.controls.username.invalid && userForm.controls.username.touched">
        請輸入用戶名
      </div>

      <input formControlName="email" placeholder="Email" />
      
      <button type="submit" [disabled]="userForm.invalid">提交</button>
    </form>
  `
})
export class UserComponent {
  // 使用 FormBuilder 或 FormGroup 初始化
  userForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value); // 自動取得校驗通過後的完整 DTO
    }
  }
}
```

---

## 三、 為什麼應該選擇 `FormGroup` 而不是自訂 `modelData`？

### 1. 豐富且自動化的狀態追蹤 (Status Tracking)

`FormGroup` 內建追蹤每個欄位及整體表單的細緻狀態，免去手動維護標記：

- `valid` / `invalid`：表單或欄位是否通過校驗。
- `touched` / `untouched`：使用者是否點擊過該欄位（適合決定何時顯示錯誤提示）。
- `dirty` / `pristine`：欄位數值是否已被使用者修改過（適合做「離開頁面未保存」提示）。
- `pending`：是否有非同步驗證 (Async Validator) 正在背景執行中。
- `disabled` / `enabled`：控制欄位停用與啟用狀態。

### 2. 強大且可複用的驗證器 (Validators & Async Validators)

`FormGroup` 支援宣告式的驗證管道，不需要在 Class 或 HTML 中寫死雜亂的 `if/else`：

```typescript
this.userForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  account: new FormControl('', [Validators.required], [this.customAsyncCheckAccount()])
});
```

可以輕鬆組合內建與自訂驗證器，甚至處理跨欄位聯合校驗（如：確認密碼二次輸入是否相同）。

### 3. 原生 RxJS 響應式資料流 (`valueChanges` & `statusChanges`)

當需要處理「連動選單」、「打字自動搜尋 (Debounce Search)」或「動態計算」時，`FormGroup` 提供了原生 Observable 串流：

```typescript
// 當使用者輸入 Email 時，自動轉換為小寫或觸發 API
this.userForm.controls.email.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(value => {
  console.log('即時輸入監聽:', value);
});
```

### 4. 完整的強型別支援 (Typed Reactive Forms)

自 Angular 14 起，`FormGroup` 與 `FormControl` 已全面支援 TypeScript 強型別。直接嘗試存取不存在的欄位或賦予錯誤資料型態，編譯期就會立刻報錯：

```typescript
// Angular 14+ Typed Form
const form = new FormGroup({
  age: new FormControl<number>(20, { nonNullable: true })
});

form.controls.age.setValue('abc'); // ❌ TS 編譯錯誤: 不能將 string 賦值給 number
```

### 5. 動態表單與動態陣列 (`FormArray`)

如果表單需求是「使用者可自由點擊 + 號新增多條聯絡人資料」，傳統 `modelData` 陣列容易出現視圖與狀態同步問題。而使用 `FormArray` 能非常優雅地管理動態控制項。

---

## 四、 對比總結表

| 比較維度 | 自訂 `modelData` + `[(ngModel)]` | `FormGroup` (Reactive Forms) |
| :--- | :--- | :--- |
| **核心架構** | Template-driven (範本驅動) | Reactive-driven (響應式驅動) |
| **狀態維護** | 需手動撰寫 logic 追蹤 | 原生內建 (`dirty`, `touched`, `valid` 等) |
| **驗證擴充性** | 複雜， logic 易散落在 HTML/TS 中 | 極高，可優雅重用與組合 Validators |
| **非同步/連動處理**| 需監聽 `(ngModelChange)` 手動處理 | 支援原生 RxJS `valueChanges` 串流操作 |
| **型別安全** | 依賴型別宣告 | Angular 14+ 提供完全 Typed 支援 |
| **動態欄位擴充** | 陣列增刪改易出現狀態同步瑕疵 | 原生支援 `FormArray` 與動態注入 |

---

## 五、 結論

雖然在非常小型、只有一兩個輸入框的臨時彈窗中，使用自訂 `modelData` 搭配 `[(ngModel)]` 速度較快；但對於中大型專案、包含商務邏輯與欄位驗證的表單而言，**`FormGroup` 絕對是更好的選擇**。

使用 `FormGroup` 不僅能幫你寫出結構清晰、易於測試、具備完全型別安全的表單程式碼，更能善用 Angular 豐富的生態系功能！
