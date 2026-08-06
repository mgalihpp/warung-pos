# Dashboard Performa Warung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tampilkan total penjualan, total laba, dan margin laba berdasarkan rentang aktif di dashboard pemilik tanpa menghapus informasi operasional.

**Architecture:** Hitung ringkasan keuangan dari `data.salesChart` yang sudah tersedia di client. Render komponen ringkasan baru sebelum kartu statistik lama, sehingga perubahan rentang dashboard otomatis memperbarui ringkasan dan grafik.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS, Recharts, TanStack Query.

## Global Constraints

- Total penjualan dan keuntungan tampil sebagai ringkasan utama serta tren visual.
- Informasi operasional tetap dipertahankan.
- Layout tetap responsif dengan pola dashboard saat ini, tanpa Bento Grid.
- Saat total penjualan nol, tampilkan margin `0%`.
- Nilai mata uang memakai formatter Rupiah yang sudah digunakan aplikasi.
- Nilai margin memakai maksimal satu angka desimal.

---

### Task 1: Add financial performance summary

**Files:**
- Modify: `features/dashboard/components/admin-dashboard-content.tsx`

**Interfaces:**
- Consumes: `DashboardData.salesChart` with `{ date, penjualan, laba }[]`.
- Produces: responsive dashboard section showing total sales, total profit, and profit margin.

- [ ] **Step 1: Add summary calculation and render component**

In `AdminDashboardContent`, calculate from `data.salesChart`:

```ts
const totalPenjualan = data.salesChart.reduce((sum, item) => sum + item.penjualan, 0)
const totalLaba = data.salesChart.reduce((sum, item) => sum + item.laba, 0)
const marginLaba = totalPenjualan > 0 ? (totalLaba / totalPenjualan) * 100 : 0
```

Render three responsive cards before existing `StatCards`, using `formatRupiah` for sales/profit and `marginLaba.toLocaleString("id-ID", { maximumFractionDigits: 1 })` for margin.

- [ ] **Step 2: Keep existing dashboard panels unchanged**

Confirm `StatCards`, `SalesChart`, `CategoryChart`, `PaymentMethods`, `RecentTransactions`, `LowStockPanel`, and `BestSellersPanel` remain rendered.

- [ ] **Step 3: Run typecheck**

Run: `rtk npm run typecheck`

Expected: command exits with code 0.

- [ ] **Step 4: Run dashboard lint**

Run: `rtk npx eslint features/dashboard/components features/dashboard/server-data.ts`

Expected: no new errors caused by dashboard summary changes.

### Task 2: Verify production build

**Files:**
- No additional files.

- [ ] **Step 1: Run production build**

Run: `rtk npm run build`

Expected: build completes successfully.

- [ ] **Step 2: Check diff hygiene**

Run: `rtk git diff --check`

Expected: no whitespace errors.
