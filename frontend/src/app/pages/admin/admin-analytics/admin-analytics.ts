import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminOverview, SupplyChainLog } from '../../../services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-admin-analytics',
  template: `
    <div class="p-6 space-y-6" style="color: white; min-height: 100vh;">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black" style="color: #86efac;">📈 Analytics Dashboard</h1>
          <p class="text-sm mt-1" style="color: rgba(255,255,255,0.4)">
            Platform performance and supply chain insights
          </p>
        </div>
        <button
          (click)="loadData()"
          class="px-4 py-2 rounded-xl text-sm font-bold"
          style="background: rgba(34,197,94,0.15); border: 1px solid rgba(74,222,128,0.3); color: #4ade80;"
        >
          🔄 Refresh
        </button>
      </div>
      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="text-center">
          <div class="text-4xl mb-3">⏳</div>
          <p style="color: rgba(255,255,255,0.4)">Loading analytics...</p>
        </div>
      </div>
      <div *ngIf="!isLoading">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            class="rounded-2xl p-4"
            style="background: rgba(3,18,8,0.7); border: 1px solid rgba(74,222,128,0.2);"
          >
            <p class="text-xs font-semibold mb-1" style="color: rgba(255,255,255,0.4)">
              TOTAL USERS
            </p>
            <p class="text-3xl font-black" style="color: #4ade80;">
              {{ overview?.totalUsers || 0 }}
            </p>
            <p class="text-xs mt-1" style="color: rgba(255,255,255,0.3)">Active accounts</p>
          </div>
          <div
            class="rounded-2xl p-4"
            style="background: rgba(3,18,8,0.7); border: 1px solid rgba(96,165,250,0.2);"
          >
            <p class="text-xs font-semibold mb-1" style="color: rgba(255,255,255,0.4)">
              TOTAL PRODUCTS
            </p>
            <p class="text-3xl font-black" style="color: #60a5fa;">
              {{ overview?.totalProducts || 0 }}
            </p>
            <p class="text-xs mt-1" style="color: rgba(255,255,255,0.3)">In supply chain</p>
          </div>
          <div
            class="rounded-2xl p-4"
            style="background: rgba(3,18,8,0.7); border: 1px solid rgba(250,204,21,0.2);"
          >
            <p class="text-xs font-semibold mb-1" style="color: rgba(255,255,255,0.4)">
              SALES VOLUME
            </p>
            <p class="text-3xl font-black" style="color: #facc15;">
              \${{ overview?.salesVolume || 0 }}
            </p>
            <p class="text-xs mt-1" style="color: rgba(255,255,255,0.3)">Total revenue</p>
          </div>
          <div
            class="rounded-2xl p-4"
            style="background: rgba(3,18,8,0.7); border: 1px solid rgba(248,113,113,0.2);"
          >
            <p class="text-xs font-semibold mb-1" style="color: rgba(255,255,255,0.4)">
              AVG RATING
            </p>
            <p class="text-3xl font-black" style="color: #f87171;">
              {{ overview?.averageRating?.toFixed(2) || '0.00' }}
            </p>
            <p class="text-xs mt-1" style="color: rgba(255,255,255,0.3)">Consumer reviews</p>
          </div>
        </div>
        <div
          class="rounded-2xl p-5 mb-6"
          style="background: rgba(3,18,8,0.7); border: 1px solid rgba(74,222,128,0.15);"
        >
          <h2 class="text-base font-black mb-4" style="color: #86efac;">
            🔗 Supply Chain Activity Breakdown
          </h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >🌾 Products Created</span
                >
                <span class="text-sm font-black" style="color: #4ade80;">{{ productCreated }}</span>
              </div>
              <div class="rounded-full h-3" style="background: rgba(255,255,255,0.05);">
                <div
                  class="h-3 rounded-full"
                  [style.width]="getBarWidth(productCreated, getMaxLogValue())"
                  style="background: linear-gradient(90deg, #22c55e, #4ade80);"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >🚛 Transfers Initiated</span
                >
                <span class="text-sm font-black" style="color: #facc15;">{{
                  transferInitiated
                }}</span>
              </div>
              <div class="rounded-full h-3" style="background: rgba(255,255,255,0.05);">
                <div
                  class="h-3 rounded-full"
                  [style.width]="getBarWidth(transferInitiated, getMaxLogValue())"
                  style="background: linear-gradient(90deg, #ca8a04, #facc15);"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >✅ Transfers Confirmed</span
                >
                <span class="text-sm font-black" style="color: #60a5fa;">{{
                  transferConfirmed
                }}</span>
              </div>
              <div class="rounded-full h-3" style="background: rgba(255,255,255,0.05);">
                <div
                  class="h-3 rounded-full"
                  [style.width]="getBarWidth(transferConfirmed, getMaxLogValue())"
                  style="background: linear-gradient(90deg, #2563eb, #60a5fa);"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >🛒 Sold to Consumer</span
                >
                <span class="text-sm font-black" style="color: #f87171;">{{ soldToConsumer }}</span>
              </div>
              <div class="rounded-full h-3" style="background: rgba(255,255,255,0.05);">
                <div
                  class="h-3 rounded-full"
                  [style.width]="getBarWidth(soldToConsumer, getMaxLogValue())"
                  style="background: linear-gradient(90deg, #dc2626, #f87171);"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            class="rounded-2xl p-5"
            style="background: rgba(3,18,8,0.7); border: 1px solid rgba(74,222,128,0.15);"
          >
            <h2 class="text-base font-black mb-4" style="color: #86efac;">
              🎯 Supply Chain Completion Rate
            </h2>
            <div class="flex items-center justify-center py-4">
              <div class="text-center">
                <div class="text-6xl font-black mb-2" style="color: #4ade80;">
                  {{ getCompletionRate() }}%
                </div>
                <p class="text-sm" style="color: rgba(255,255,255,0.4)">
                  Products that completed full chain
                </p>
                <p class="text-xs mt-1" style="color: rgba(255,255,255,0.3)">
                  {{ transferConfirmed }} of {{ productCreated }} products verified
                </p>
              </div>
            </div>
            <div class="mt-3 rounded-full h-4" style="background: rgba(255,255,255,0.05);">
              <div
                class="h-4 rounded-full"
                [style.width]="getCompletionRate() + '%'"
                style="background: linear-gradient(90deg, #15803d, #4ade80);"
              ></div>
            </div>
          </div>
          <div
            class="rounded-2xl p-5"
            style="background: rgba(3,18,8,0.7); border: 1px solid rgba(74,222,128,0.15);"
          >
            <h2 class="text-base font-black mb-4" style="color: #86efac;">🏥 Platform Health</h2>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center p-3 rounded-xl"
                style="background: rgba(34,197,94,0.08);"
              >
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >Total Transactions</span
                >
                <span class="font-black" style="color: #4ade80;">{{
                  overview?.totalLogs || 0
                }}</span>
              </div>
              <div
                class="flex justify-between items-center p-3 rounded-xl"
                style="background: rgba(34,197,94,0.08);"
              >
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >Consumer Feedbacks</span
                >
                <span class="font-black" style="color: #4ade80;">{{
                  overview?.totalFeedbacks || 0
                }}</span>
              </div>
              <div
                class="flex justify-between items-center p-3 rounded-xl"
                style="background: rgba(34,197,94,0.08);"
              >
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >Pending Orders</span
                >
                <span class="font-black" style="color: #facc15;">{{
                  overview?.pendingOrders || 0
                }}</span>
              </div>
              <div
                class="flex justify-between items-center p-3 rounded-xl"
                style="background: rgba(34,197,94,0.08);"
              >
                <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.7)"
                  >New Users Today</span
                >
                <span class="font-black" style="color: #60a5fa;">{{
                  overview?.newUsersToday || 0
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="rounded-2xl p-5"
          style="background: rgba(3,18,8,0.7); border: 1px solid rgba(74,222,128,0.15);"
        >
          <h2 class="text-base font-black mb-4" style="color: #86efac;">
            🕐 Recent Supply Chain Activity
          </h2>
          <div
            *ngIf="getRecentLogs().length === 0"
            class="text-center py-8"
            style="color: rgba(255,255,255,0.3)"
          >
            No activity logs found.
          </div>
          <div class="space-y-2">
            <div
              *ngFor="let log of getRecentLogs()"
              class="flex items-center justify-between p-3 rounded-xl"
              style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2 h-2 rounded-full"
                  [style.background]="getActionColor(log.action)"
                ></div>
                <div>
                  <p class="text-sm font-bold" [style.color]="getActionColor(log.action)">
                    {{ log.action }}
                  </p>
                  <p class="text-xs" style="color: rgba(255,255,255,0.3)">{{ log.details }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs font-semibold" style="color: rgba(255,255,255,0.5)">
                  Product #{{ log.productId }}
                </p>
                <p class="text-xs" style="color: rgba(255,255,255,0.3)">
                  {{ log.timestamp | date: 'short' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminAnalytics implements OnInit {
  overview?: AdminOverview;
  logs: SupplyChainLog[] = [];
  isLoading = true;

  // Computed stats
  productCreated = 0;
  transferInitiated = 0;
  transferConfirmed = 0;
  soldToConsumer = 0;

  roleDistribution: { role: string; count: number; color: string }[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.adminService.getOverview().subscribe({
      next: (res) => {
        this.overview = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.adminService.getSystemLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.productCreated = logs.filter((l) => l.action === 'Product Created').length;
        this.transferInitiated = logs.filter((l) => l.action === 'Transfer Initiated').length;
        this.transferConfirmed = logs.filter((l) => l.action === 'Transfer Confirmed').length;
        this.soldToConsumer = logs.filter((l) =>
          l.details?.toLowerCase().includes('consumer'),
        ).length;
      },
    });
  }

  getCompletionRate(): number {
    if (this.productCreated === 0) return 0;
    const rate = Math.round((this.transferConfirmed / this.productCreated) * 100);
    return Math.min(100, rate);
  }

  getBarWidth(value: number, max: number): string {
    if (max === 0) return '0%';
    return Math.round((value / max) * 100) + '%';
  }

  getMaxLogValue(): number {
    return Math.max(
      this.productCreated,
      this.transferInitiated,
      this.transferConfirmed,
      this.soldToConsumer,
      1,
    );
  }

  getRecentLogs(): SupplyChainLog[] {
    return this.logs.slice(0, 6);
  }

  getActionColor(action: string): string {
    if (action === 'Product Created') return '#4ade80';
    if (action === 'Transfer Initiated') return '#facc15';
    if (action === 'Transfer Confirmed') return '#60a5fa';
    return '#f87171';
  }
}