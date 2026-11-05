/**
 * AuraTask - Premium Smart To-Do Application
 * Vanilla JavaScript (ES6+) Implementation
 * 
 * Features:
 * - Reactive LocalStorage persistence
 * - Complete CRUD with instant UI sync
 * - Real-time Dashboard with SVG gauge & live clock
 * - Dynamic Search, Multi-Filter & Multi-Sort
 * - Dark & Light Glassmorphism Theme Engine
 * - Canvas Confetti Particle Celebration System
 * - Keyboard Shortcuts & Toast Notifications
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. STORAGE & STATE MANAGEMENT
     ========================================================================== */
  const STORAGE_KEYS = {
    TASKS: 'auratask_tasks_v2',
    THEME: 'auratask_theme_v2',
    SETTINGS: 'auratask_settings_v2',
    VIEW_MODE: 'auratask_view_mode_v2'
  };

  // Seed sample tasks for pristine first-load experience
  const DEFAULT_SAMPLE_TASKS = [
    {
      id: 'task-seed-1',
      title: 'Review quarterly architecture roadmap & KPIs',
      description: 'Audit microservices performance bottlenecks and draft Q3 scaling proposal for the engineering leadership review.',
      priority: 'high',
      category: 'work',
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
      completed: false,
      pinned: true,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'task-seed-2',
      title: 'Finalize glassmorphism UI prototype for AuraTask',
      description: 'Ensure smooth backdrop-filters, neon glow accents, responsive grid cards, and seamless accessibility.',
      priority: 'high',
      category: 'work',
      dueDate: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16), // Later today
      completed: true,
      pinned: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'task-seed-3',
      title: 'Read 2 chapters of "Designing Data-Intensive Applications"',
      description: 'Focus on distributed consensus protocols and partition tolerance.',
      priority: 'medium',
      category: 'study',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
      completed: false,
      pinned: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'task-seed-4',
      title: 'Weekly portfolio rebalancing & budget reconciliation',
      description: 'Track index fund dividends and update monthly savings projections in spreadsheet.',
      priority: 'low',
      category: 'finance',
      dueDate: new Date(Date.now() - 3600000 * 12).toISOString().slice(0, 16), // Overdue for demo
      completed: false,
      pinned: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'task-seed-5',
      title: 'Morning 5km endurance run & mobility workout',
      description: 'Keep average pace under 5:15/km and finish with 15 mins hip mobility stretch.',
      priority: 'medium',
      category: 'health',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      completed: true,
      pinned: false,
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
    }
  ];

  class StorageService {
    static getTasks() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
        if (!raw) {
          // Initialize with default tasks on first launch
          this.saveTasks(DEFAULT_SAMPLE_TASKS);
          return DEFAULT_SAMPLE_TASKS;
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.error('Failed to parse tasks from localStorage:', err);
        return [];
      }
    }

    static saveTasks(tasks) {
      try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      } catch (err) {
        console.error('Failed to save tasks to localStorage:', err);
      }
    }

    static getTheme() {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    }

    static saveTheme(theme) {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    static getViewMode() {
      return localStorage.getItem(STORAGE_KEYS.VIEW_MODE) || 'grid';
    }

    static saveViewMode(mode) {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    }
  }

  /* ==========================================================================
     2. CONFETTI CELEBRATION ENGINE (Pure HTML5 Canvas Particles)
     ========================================================================== */
  class ConfettiEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.particles = [];
      this.animationFrame = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    fire(x = window.innerWidth / 2, y = window.innerHeight * 0.6) {
      if (!this.ctx) return;

      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#38bdf8', '#f43f5e'];
      const count = 75;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          gravity: 0.22,
          opacity: 1,
          decay: Math.random() * 0.015 + 0.01
        });
      }

      if (!this.animationFrame) {
        this.animate();
      }
    }

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animationFrame = requestAnimationFrame(() => this.animate());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animationFrame = null;
      }
    }
  }

  /* ==========================================================================
     4. TOAST NOTIFICATION SERVICE
     ========================================================================== */
  class ToastService {
    static show(title, message = '', type = 'success', duration = 3500) {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const iconSvg = this.getIcon(type);

      toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
          <div class="toast-title">${this.escapeHTML(title)}</div>
          ${message ? `<div class="toast-message">${this.escapeHTML(message)}</div>` : ''}
        </div>
        <button class="toast-close-btn" aria-label="Close notification">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
      `;

      container.appendChild(toast);

      const dismiss = () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      };

      const closeBtn = toast.querySelector('.toast-close-btn');
      closeBtn.addEventListener('click', dismiss);

      const timer = setTimeout(dismiss, duration);
      toast.addEventListener('mouseenter', () => clearTimeout(timer));
    }

    static getIcon(type) {
      switch (type) {
        case 'success':
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>`;
        case 'error':
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>`;
        case 'warning':
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>`;
        case 'info':
        default:
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>`;
      }
    }

    static escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  /* ==========================================================================
     3. MAIN APP CONTROLLER
     ========================================================================== */
  class AuraTaskApp {
    constructor() {
      this.tasks = StorageService.getTasks();
      this.confetti = new ConfettiEngine(document.getElementById('confettiCanvas'));

      // Filter & Sort state
      this.currentFilter = 'all'; // all, active, completed, overdue
      this.currentSearch = '';
      this.currentPriority = 'all';
      this.currentCategory = 'all';
      this.currentSort = 'newest';
      this.viewMode = StorageService.getViewMode();

      // Modal state
      this.activeEditingTaskId = null;
      this.pendingConfirmAction = null;

      // Cache DOM Elements
      this.dom = {
        // Theme
        btnToggleTheme: document.getElementById('btnToggleTheme'),
        moonIcon: document.getElementById('moonIcon'),
        sunIcon: document.getElementById('sunIcon'),

        // Clock
        clockTime: document.getElementById('clockTime'),
        clockDate: document.getElementById('clockDate'),

        // Dashboard Stats
        statTotalCount: document.getElementById('statTotalCount'),
        statCompletedCount: document.getElementById('statCompletedCount'),
        statCompletedRatio: document.getElementById('statCompletedRatio'),
        statPendingCount: document.getElementById('statPendingCount'),
        statOverdueCount: document.getElementById('statOverdueCount'),
        statOverdueNotice: document.getElementById('statOverdueNotice'),
        barTotal: document.getElementById('barTotal'),
        barCompleted: document.getElementById('barCompleted'),
        barPending: document.getElementById('barPending'),
        barOverdue: document.getElementById('barOverdue'),
        gaugeMeter: document.getElementById('gaugeMeter'),
        gaugePercentage: document.getElementById('gaugePercentage'),
        gaugeMotivation: document.getElementById('gaugeMotivation'),
        productivityText: document.getElementById('productivityText'),

        // Toolbar & Filters
        searchInput: document.getElementById('searchInput'),
        btnClearSearch: document.getElementById('btnClearSearch'),
        btnViewGrid: document.getElementById('btnViewGrid'),
        btnViewList: document.getElementById('btnViewList'),
        filterTabs: document.querySelectorAll('.tab-btn'),
        tabCountAll: document.getElementById('tabCountAll'),
        tabCountActive: document.getElementById('tabCountActive'),
        tabCountCompleted: document.getElementById('tabCountCompleted'),
        tabCountOverdue: document.getElementById('tabCountOverdue'),
        filterPriority: document.getElementById('filterPriority'),
        filterCategory: document.getElementById('filterCategory'),
        sortBy: document.getElementById('sortBy'),
        btnResetFilters: document.getElementById('btnResetFilters'),
        activeFilterChips: document.getElementById('activeFilterChips'),

        // Action Menu
        btnActionMenu: document.getElementById('btnActionMenu'),
        bulkActionDropdown: document.getElementById('bulkActionDropdown'),
        btnActionClearCompleted: document.getElementById('btnActionClearCompleted'),
        btnActionMarkAllCompleted: document.getElementById('btnActionMarkAllCompleted'),
        btnActionDeleteAll: document.getElementById('btnActionDeleteAll'),

        // Task Workspace
        tasksGrid: document.getElementById('tasksGrid'),
        emptyState: document.getElementById('emptyState'),
        emptyStateTitle: document.getElementById('emptyStateTitle'),
        emptyStateSubtitle: document.getElementById('emptyStateSubtitle'),
        btnEmptyStateAction: document.getElementById('btnEmptyStateAction'),

        // Task Form Modal
        taskModal: document.getElementById('taskModal'),
        taskModalBackdrop: document.getElementById('taskModalBackdrop'),
        btnOpenNewTaskModal: document.getElementById('btnOpenNewTaskModal'),
        btnCloseTaskModal: document.getElementById('btnCloseTaskModal'),
        btnCancelTaskModal: document.getElementById('btnCancelTaskModal'),
        taskForm: document.getElementById('taskForm'),
        taskIdInput: document.getElementById('taskIdInput'),
        taskTitleInput: document.getElementById('taskTitleInput'),
        taskDescriptionInput: document.getElementById('taskDescriptionInput'),
        taskCategorySelect: document.getElementById('taskCategorySelect'),
        taskDueDateInput: document.getElementById('taskDueDateInput'),
        titleCharCount: document.getElementById('titleCharCount'),
        descCharCount: document.getElementById('descCharCount'),
        titleErrorMsg: document.getElementById('titleErrorMsg'),
        taskModalTitle: document.getElementById('taskModalTitle'),
        taskModalSubtitle: document.getElementById('taskModalSubtitle'),
        modalIconAdd: document.getElementById('modalIconAdd'),
        modalIconEdit: document.getElementById('modalIconEdit'),
        btnSubmitTaskText: document.getElementById('btnSubmitTaskText'),
        btnDueToday: document.getElementById('btnDueToday'),
        btnDueTomorrow: document.getElementById('btnDueTomorrow'),
        btnDueNextWeek: document.getElementById('btnDueNextWeek'),

        // Confirmation Modal
        confirmModal: document.getElementById('confirmModal'),
        confirmModalBackdrop: document.getElementById('confirmModalBackdrop'),
        confirmModalTitle: document.getElementById('confirmModalTitle'),
        confirmModalMessage: document.getElementById('confirmModalMessage'),
        btnCancelConfirm: document.getElementById('btnCancelConfirm'),
        btnAcceptConfirm: document.getElementById('btnAcceptConfirm'),

        // Shortcuts Modal
        shortcutsModal: document.getElementById('shortcutsModal'),
        shortcutsModalBackdrop: document.getElementById('shortcutsModalBackdrop'),
        btnOpenShortcuts: document.getElementById('btnOpenShortcuts'),
        btnCloseShortcutsModal: document.getElementById('btnCloseShortcutsModal')
      };

      this.init();
    }

    init() {
      this.initTheme();
      this.initViewMode();
      this.initClock();
      this.bindEvents();
      this.render();
    }

    /* ------------------------------------------------------------------------
       Theme & Visual Configuration
       ------------------------------------------------------------------------ */
    initTheme() {
      const savedTheme = StorageService.getTheme();
      this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      StorageService.saveTheme(theme);

      if (theme === 'dark') {
        this.dom.moonIcon.classList.remove('hidden');
        this.dom.sunIcon.classList.add('hidden');
      } else {
        this.dom.moonIcon.classList.add('hidden');
        this.dom.sunIcon.classList.remove('hidden');
      }
    }

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
      ToastService.show('Theme Switched', `Active mode: ${next.toUpperCase()}`, 'info', 2000);
    }

    initViewMode() {
      this.applyViewMode(this.viewMode);
    }

    applyViewMode(mode) {
      this.viewMode = mode;
      StorageService.saveViewMode(mode);

      if (mode === 'grid') {
        this.dom.tasksGrid.classList.remove('view-list');
        this.dom.tasksGrid.classList.add('view-grid');
        this.dom.btnViewGrid.classList.add('active');
        this.dom.btnViewList.classList.remove('active');
      } else {
        this.dom.tasksGrid.classList.remove('view-grid');
        this.dom.tasksGrid.classList.add('view-list');
        this.dom.btnViewList.classList.add('active');
        this.dom.btnViewGrid.classList.remove('active');
      }
    }

    /* ------------------------------------------------------------------------
       Live Clock & Date Engine
       ------------------------------------------------------------------------ */
    initClock() {
      const update = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        this.dom.clockTime.textContent = `${hours}:${minutes}:${seconds}`;

        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        this.dom.clockDate.textContent = now.toLocaleDateString(undefined, options);
      };

      update();
      setInterval(update, 1000);
    }

    /* ------------------------------------------------------------------------
       Event Listeners Binding
       ------------------------------------------------------------------------ */
    bindEvents() {
      // Theme
      this.dom.btnToggleTheme.addEventListener('click', () => this.toggleTheme());

      // View Mode Toggle
      this.dom.btnViewGrid.addEventListener('click', () => this.applyViewMode('grid'));
      this.dom.btnViewList.addEventListener('click', () => this.applyViewMode('list'));

      // Modals
      this.dom.btnOpenNewTaskModal.addEventListener('click', () => this.openTaskModal());
      this.dom.btnCloseTaskModal.addEventListener('click', () => this.closeTaskModal());
      this.dom.btnCancelTaskModal.addEventListener('click', () => this.closeTaskModal());
      this.dom.taskModalBackdrop.addEventListener('click', () => this.closeTaskModal());

      this.dom.btnEmptyStateAction.addEventListener('click', () => this.openTaskModal());

      // Shortcuts Modal
      this.dom.btnOpenShortcuts.addEventListener('click', () => this.openShortcutsModal());
      this.dom.btnCloseShortcutsModal.addEventListener('click', () => this.closeShortcutsModal());
      this.dom.shortcutsModalBackdrop.addEventListener('click', () => this.closeShortcutsModal());

      // Confirm Modal
      this.dom.btnCancelConfirm.addEventListener('click', () => this.closeConfirmModal());
      this.dom.confirmModalBackdrop.addEventListener('click', () => this.closeConfirmModal());
      this.dom.btnAcceptConfirm.addEventListener('click', () => {
        if (typeof this.pendingConfirmAction === 'function') {
          this.pendingConfirmAction();
        }
        this.closeConfirmModal();
      });

      // Task Form Submissions & Validations
      this.dom.taskForm.addEventListener('submit', (e) => this.handleTaskFormSubmit(e));
      this.dom.taskTitleInput.addEventListener('input', () => this.handleTitleInput());
      this.dom.taskDescriptionInput.addEventListener('input', () => {
        this.dom.descCharCount.textContent = `${this.dom.taskDescriptionInput.value.length} / 300`;
      });

      // Quick Due Presets
      this.dom.btnDueToday.addEventListener('click', () => this.setDuePreset('today'));
      this.dom.btnDueTomorrow.addEventListener('click', () => this.setDuePreset('tomorrow'));
      this.dom.btnDueNextWeek.addEventListener('click', () => this.setDuePreset('nextWeek'));

      // Search & Filters
      this.dom.searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.trim().toLowerCase();
        this.dom.btnClearSearch.classList.toggle('hidden', !this.currentSearch);
        this.render();
      });

      this.dom.btnClearSearch.addEventListener('click', () => {
        this.dom.searchInput.value = '';
        this.currentSearch = '';
        this.dom.btnClearSearch.classList.add('hidden');
        this.render();
      });

      // Status Tabs
      this.dom.filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.dom.filterTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          this.currentFilter = tab.dataset.filter;
          this.render();
        });
      });

      // Dropdown Filters
      this.dom.filterPriority.addEventListener('change', (e) => {
        this.currentPriority = e.target.value;
        this.render();
      });

      this.dom.filterCategory.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.render();
      });

      this.dom.sortBy.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.render();
      });

      this.dom.btnResetFilters.addEventListener('click', () => this.resetFilters());

      // Bulk Action Dropdown Menu
      this.dom.btnActionMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = this.dom.btnActionMenu.getAttribute('aria-expanded') === 'true';
        this.dom.btnActionMenu.setAttribute('aria-expanded', !isExpanded);
        this.dom.bulkActionDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!this.dom.btnActionMenu.contains(e.target) && !this.dom.bulkActionDropdown.contains(e.target)) {
          this.dom.bulkActionDropdown.classList.add('hidden');
          this.dom.btnActionMenu.setAttribute('aria-expanded', 'false');
        }
      });

      this.dom.btnActionClearCompleted.addEventListener('click', () => {
        this.dom.bulkActionDropdown.classList.add('hidden');
        this.promptClearCompleted();
      });

      this.dom.btnActionMarkAllCompleted.addEventListener('click', () => {
        this.dom.bulkActionDropdown.classList.add('hidden');
        this.markAllCompleted();
      });

      this.dom.btnActionDeleteAll.addEventListener('click', () => {
        this.dom.bulkActionDropdown.classList.add('hidden');
        this.promptDeleteAll();
      });

      // Keyboard Shortcuts
      document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    }

    handleGlobalKeydown(e) {
      // Don't trigger shortcuts if focus is inside an input/textarea and key is not Escape
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (e.key === 'Escape') {
        this.closeAllModals();
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        this.openTaskModal();
      } else if (e.key === '/') {
        e.preventDefault();
        this.dom.searchInput.focus();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      } else if (e.key === '?') {
        e.preventDefault();
        this.openShortcutsModal();
      }
    }

    closeAllModals() {
      this.closeTaskModal();
      this.closeConfirmModal();
      this.closeShortcutsModal();
      this.dom.bulkActionDropdown.classList.add('hidden');
    }

    /* ------------------------------------------------------------------------
       Dashboard Calculations & Updates
       ------------------------------------------------------------------------ */
    updateDashboard() {
      const now = new Date();
      const total = this.tasks.length;
      const completed = this.tasks.filter(t => t.completed).length;
      const pending = total - completed;

      const overdue = this.tasks.filter(t => {
        if (t.completed || !t.dueDate) return false;
        return new Date(t.dueDate) < now;
      }).length;

      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Update counters
      this.animateCounter(this.dom.statTotalCount, total);
      this.animateCounter(this.dom.statCompletedCount, completed);
      this.animateCounter(this.dom.statPendingCount, pending);
      this.animateCounter(this.dom.statOverdueCount, overdue);

      this.dom.statCompletedRatio.textContent = `${completionRate}% done`;

      if (overdue > 0) {
        this.dom.statOverdueNotice.textContent = `${overdue} urgent task${overdue > 1 ? 's' : ''}`;
        this.dom.statOverdueNotice.className = 'stat-trend danger';
      } else {
        this.dom.statOverdueNotice.textContent = 'All on track';
        this.dom.statOverdueNotice.className = 'stat-trend success';
      }

      // Update linear progress bars
      this.dom.barTotal.style.width = '100%';
      this.dom.barCompleted.style.width = total > 0 ? `${(completed / total) * 100}%` : '0%';
      this.dom.barPending.style.width = total > 0 ? `${(pending / total) * 100}%` : '0%';
      this.dom.barOverdue.style.width = total > 0 ? `${(overdue / total) * 100}%` : '0%';

      // Update SVG Circular Radial Gauge
      // Circumference = 2 * PI * r = 2 * 3.14159 * 42 = 263.89
      const circumference = 263.89;
      const offset = circumference - (completionRate / 100) * circumference;
      this.dom.gaugeMeter.style.strokeDashoffset = offset;
      this.dom.gaugePercentage.textContent = `${completionRate}%`;

      // Update gauge motivation message
      if (total === 0) {
        this.dom.gaugeMotivation.textContent = 'Create your first task to jumpstart productivity.';
        this.dom.productivityText.textContent = 'Start fresh today';
      } else if (completionRate === 100) {
        this.dom.gaugeMotivation.textContent = '🎉 Incredible! All goals completed for today!';
        this.dom.productivityText.textContent = '100% Productivity Achieved';
      } else if (completionRate >= 75) {
        this.dom.gaugeMotivation.textContent = 'Almost at the finish line! Keep the momentum!';
        this.dom.productivityText.textContent = 'Peak momentum in progress';
      } else if (completionRate >= 40) {
        this.dom.gaugeMotivation.textContent = 'Steady steady progress! You are doing great.';
        this.dom.productivityText.textContent = 'Good rhythm maintained';
      } else {
        this.dom.gaugeMotivation.textContent = 'Small steps lead to great accomplishments.';
        this.dom.productivityText.textContent = 'Building up momentum';
      }

      // Update Tab Counter Badges
      this.dom.tabCountAll.textContent = total;
      this.dom.tabCountActive.textContent = pending;
      this.dom.tabCountCompleted.textContent = completed;
      this.dom.tabCountOverdue.textContent = overdue;
    }

    animateCounter(element, targetValue) {
      const current = parseInt(element.textContent, 10) || 0;
      if (current === targetValue) return;

      const duration = 400;
      const startTime = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.round(current + (targetValue - current) * progress);
        element.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = targetValue;
        }
      };

      requestAnimationFrame(step);
    }

    /* ------------------------------------------------------------------------
       Task Filtering & Sorting Algorithm
       ------------------------------------------------------------------------ */
    getFilteredAndSortedTasks() {
      const now = new Date();

      return this.tasks
        .filter(task => {
          // 1. Status Filter Tab
          if (this.currentFilter === 'active' && task.completed) return false;
          if (this.currentFilter === 'completed' && !task.completed) return false;
          if (this.currentFilter === 'overdue') {
            if (task.completed || !task.dueDate) return false;
            if (new Date(task.dueDate) >= now) return false;
          }

          // 2. Priority Filter
          if (this.currentPriority !== 'all' && task.priority !== this.currentPriority) {
            return false;
          }

          // 3. Category Filter
          if (this.currentCategory !== 'all' && task.category !== this.currentCategory) {
            return false;
          }

          // 4. Search Filter
          if (this.currentSearch) {
            const titleMatch = task.title.toLowerCase().includes(this.currentSearch);
            const descMatch = (task.description || '').toLowerCase().includes(this.currentSearch);
            const catMatch = (task.category || '').toLowerCase().includes(this.currentSearch);
            if (!titleMatch && !descMatch && !catMatch) return false;
          }

          return true;
        })
        .sort((a, b) => {
          // Pinned tasks always stay on top
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;

          // Priority rank map
          const priorityRank = { high: 3, medium: 2, low: 1 };

          switch (this.currentSort) {
            case 'oldest':
              return new Date(a.createdAt) - new Date(b.createdAt);
            case 'dueDateAsc':
              if (!a.dueDate) return 1;
              if (!b.dueDate) return -1;
              return new Date(a.dueDate) - new Date(b.dueDate);
            case 'dueDateDesc':
              if (!a.dueDate) return 1;
              if (!b.dueDate) return -1;
              return new Date(b.dueDate) - new Date(a.dueDate);
            case 'priority':
              return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
            case 'alphabetical':
              return a.title.localeCompare(b.title);
            case 'newest':
            default:
              return new Date(b.createdAt) - new Date(a.createdAt);
          }
        });
    }

    /* ------------------------------------------------------------------------
       Rendering Engine
       ------------------------------------------------------------------------ */
    render() {
      this.updateDashboard();
      this.renderFilterChips();

      const filteredTasks = this.getFilteredAndSortedTasks();
      this.dom.tasksGrid.innerHTML = '';

      if (filteredTasks.length === 0) {
        this.dom.emptyState.classList.remove('hidden');
        this.updateEmptyStateMessage();
      } else {
        this.dom.emptyState.classList.add('hidden');
        filteredTasks.forEach(task => {
          const card = this.createTaskCardElement(task);
          this.dom.tasksGrid.appendChild(card);
        });
      }

      // Check if any filter is active to show Reset button
      const hasActiveFilters = this.currentFilter !== 'all' ||
                               this.currentPriority !== 'all' ||
                               this.currentCategory !== 'all' ||
                               this.currentSearch !== '' ||
                               this.currentSort !== 'newest';

      this.dom.btnResetFilters.classList.toggle('hidden', !hasActiveFilters);
    }

    updateEmptyStateMessage() {
      if (this.currentSearch) {
        this.dom.emptyStateTitle.textContent = 'No matching tasks';
        this.dom.emptyStateSubtitle.textContent = `No tasks matched your query "${this.currentSearch}". Try a different search keyword.`;
      } else if (this.currentFilter === 'completed') {
        this.dom.emptyStateTitle.textContent = 'No completed tasks yet';
        this.dom.emptyStateSubtitle.textContent = 'Check off active tasks as you finish them to build momentum!';
      } else if (this.currentFilter === 'overdue') {
        this.dom.emptyStateTitle.textContent = 'No overdue tasks';
        this.dom.emptyStateSubtitle.textContent = 'All set! You have no overdue tasks pending.';
      } else if (this.currentPriority !== 'all' || this.currentCategory !== 'all') {
        this.dom.emptyStateTitle.textContent = 'No tasks match current filters';
        this.dom.emptyStateSubtitle.textContent = 'Adjust or reset your category and priority filters to view other tasks.';
      } else {
        this.dom.emptyStateTitle.textContent = 'Your task list is empty';
        this.dom.emptyStateSubtitle.textContent = 'Add your first task and start conquering your productivity goals!';
      }
    }

    renderFilterChips() {
      this.dom.activeFilterChips.innerHTML = '';

      const chips = [];
      if (this.currentFilter !== 'all') {
        chips.push({ label: `Status: ${this.capitalize(this.currentFilter)}`, key: 'filter' });
      }
      if (this.currentPriority !== 'all') {
        chips.push({ label: `Priority: ${this.capitalize(this.currentPriority)}`, key: 'priority' });
      }
      if (this.currentCategory !== 'all') {
        chips.push({ label: `Category: ${this.capitalize(this.currentCategory)}`, key: 'category' });
      }
      if (this.currentSearch) {
        chips.push({ label: `Search: "${this.currentSearch}"`, key: 'search' });
      }

      chips.forEach(chip => {
        const span = document.createElement('div');
        span.className = 'filter-chip';
        span.innerHTML = `
          <span>${chip.label}</span>
          <button class="filter-chip-remove" title="Remove filter" aria-label="Remove filter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;

        span.querySelector('.filter-chip-remove').addEventListener('click', () => {
          if (chip.key === 'filter') {
            this.currentFilter = 'all';
            this.dom.filterTabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
          } else if (chip.key === 'priority') {
            this.currentPriority = 'all';
            this.dom.filterPriority.value = 'all';
          } else if (chip.key === 'category') {
            this.currentCategory = 'all';
            this.dom.filterCategory.value = 'all';
          } else if (chip.key === 'search') {
            this.currentSearch = '';
            this.dom.searchInput.value = '';
            this.dom.btnClearSearch.classList.add('hidden');
          }
          this.render();
        });

        this.dom.activeFilterChips.appendChild(span);
      });
    }

    resetFilters() {
      this.currentFilter = 'all';
      this.currentSearch = '';
      this.currentPriority = 'all';
      this.currentCategory = 'all';
      this.currentSort = 'newest';

      this.dom.searchInput.value = '';
      this.dom.btnClearSearch.classList.add('hidden');
      this.dom.filterPriority.value = 'all';
      this.dom.filterCategory.value = 'all';
      this.dom.sortBy.value = 'newest';

      this.dom.filterTabs.forEach(t => {
        const isAll = t.dataset.filter === 'all';
        t.classList.toggle('active', isAll);
        t.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      ToastService.show('Filters Reset', 'Showing all tasks with newest first.', 'info', 2000);
      this.render();
    }

    /* ------------------------------------------------------------------------
       Task Card Component Generator
       ------------------------------------------------------------------------ */
    createTaskCardElement(task) {
      const card = document.createElement('article');
      card.className = `task-card priority-${task.priority} ${task.completed ? 'is-completed' : ''} ${task.pinned ? 'is-pinned' : ''}`;
      card.dataset.id = task.id;

      // Due date evaluation
      const dueInfo = this.formatDueDate(task.dueDate, task.completed);
      const createdDateStr = this.formatRelativeTime(task.createdAt);
      const categoryIcon = this.getCategoryEmoji(task.category);

      card.innerHTML = `
        ${task.pinned ? `
          <div class="task-pinned-badge" title="Pinned to top">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 12V4H17V2H7V4H8V12L5 15V17H11V22L12 23L13 22V17H19V15L16 12Z"/>
            </svg>
            <span>Pinned</span>
          </div>` : ''}

        <div class="task-card-header">
          <label class="task-checkbox-container" title="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
            <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
            <span class="task-checkbox-custom"></span>
          </label>
          <div class="task-title-group">
            <h4 class="task-title">${this.escapeHTML(task.title)}</h4>
            ${task.description ? `<p class="task-description">${this.escapeHTML(task.description)}</p>` : ''}
          </div>
        </div>

        <div class="task-meta-row">
          <span class="task-badge badge-priority-${task.priority}">
            ${this.capitalize(task.priority)}
          </span>
          <span class="task-badge task-badge-cat">
            ${categoryIcon} ${this.capitalize(task.category || 'Other')}
          </span>
          ${dueInfo ? `
            <span class="task-due-badge ${dueInfo.statusClass}" title="${dueInfo.fullText}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${dueInfo.shortText}</span>
            </span>
          ` : ''}
        </div>

        <div class="task-card-footer">
          <span class="task-date-created">Created ${createdDateStr}</span>
          <div class="task-actions">
            <button class="task-action-btn btn-pin ${task.pinned ? 'pinned' : ''}" title="${task.pinned ? 'Unpin task' : 'Pin to top'}" aria-label="Toggle pin">
              <svg viewBox="0 0 24 24" fill="${task.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="17" x2="12" y2="22"></line>
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
              </svg>
            </button>
            <button class="task-action-btn btn-duplicate" title="Duplicate task" aria-label="Duplicate task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="task-action-btn btn-edit" title="Edit task" aria-label="Edit task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="task-action-btn btn-delete" title="Delete task" aria-label="Delete task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;

      // Checkbox event
      const checkbox = card.querySelector('.task-checkbox-input');
      checkbox.addEventListener('change', (e) => {
        this.toggleTaskCompleted(task.id, e.target.checked, e);
      });

      // Pin event
      const pinBtn = card.querySelector('.btn-pin');
      pinBtn.addEventListener('click', () => {
        this.toggleTaskPinned(task.id);
      });

      // Duplicate event
      const duplicateBtn = card.querySelector('.btn-duplicate');
      duplicateBtn.addEventListener('click', () => {
        this.duplicateTask(task);
      });

      // Edit event
      const editBtn = card.querySelector('.btn-edit');
      editBtn.addEventListener('click', () => {
        this.openTaskModal(task);
      });

      // Delete event
      const deleteBtn = card.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => {
        this.promptDeleteTask(task);
      });

      return card;
    }

    /* ------------------------------------------------------------------------
       CRUD Operations
       ------------------------------------------------------------------------ */
    toggleTaskCompleted(id, completed, event) {
      const task = this.tasks.find(t => t.id === id);
      if (!task) return;

      task.completed = completed;
      StorageService.saveTasks(this.tasks);

      if (completed) {
        // Fire confetti from checkbox location
        if (event && event.clientX && event.clientY) {
          this.confetti.fire(event.clientX, event.clientY);
        } else {
          this.confetti.fire();
        }
        ToastService.show('Task Completed!', `"${task.title}" has been completed.`, 'success', 2500);
      } else {
        ToastService.show('Task Moved to Active', `"${task.title}" marked as pending.`, 'info', 2000);
      }

      this.render();
    }

    toggleTaskPinned(id) {
      const task = this.tasks.find(t => t.id === id);
      if (!task) return;

      task.pinned = !task.pinned;
      StorageService.saveTasks(this.tasks);

      ToastService.show(
        task.pinned ? 'Task Pinned' : 'Task Unpinned',
        task.pinned ? 'Pinned to the top of your list' : 'Restored to normal sort order',
        'info',
        2000
      );

      this.render();
    }

    duplicateTask(task) {
      const copy = {
        ...task,
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        title: `${task.title} (Copy)`,
        completed: false,
        createdAt: new Date().toISOString()
      };

      this.tasks.unshift(copy);
      StorageService.saveTasks(this.tasks);
      ToastService.show('Task Duplicated', `Created a copy of "${task.title}".`, 'success', 2500);
      this.render();
    }

    promptDeleteTask(task) {
      this.dom.confirmModalTitle.textContent = 'Delete Task?';
      this.dom.confirmModalMessage.textContent = `Are you sure you want to permanently delete "${task.title}"? This action cannot be undone.`;

      this.pendingConfirmAction = () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        StorageService.saveTasks(this.tasks);
        ToastService.show('Task Deleted', 'Task has been permanently removed.', 'error', 2500);
        this.render();
      };

      this.openConfirmModal();
    }

    promptClearCompleted() {
      const completedCount = this.tasks.filter(t => t.completed).length;
      if (completedCount === 0) {
        ToastService.show('No Completed Tasks', 'There are no completed tasks to clear.', 'info', 2500);
        return;
      }

      this.dom.confirmModalTitle.textContent = 'Clear Completed Tasks?';
      this.dom.confirmModalMessage.textContent = `This will permanently delete all ${completedCount} completed task${completedCount > 1 ? 's' : ''}. Proceed?`;

      this.pendingConfirmAction = () => {
        this.tasks = this.tasks.filter(t => !t.completed);
        StorageService.saveTasks(this.tasks);
        ToastService.show('Completed Tasks Cleared', `Successfully removed ${completedCount} completed task(s).`, 'success', 3000);
        this.render();
      };

      this.openConfirmModal();
    }

    markAllCompleted() {
      const pendingCount = this.tasks.filter(t => !t.completed).length;
      if (pendingCount === 0) {
        ToastService.show('All Tasks Already Completed', 'Great job! Everything is checked off.', 'info', 2500);
        return;
      }

      this.tasks.forEach(t => t.completed = true);
      StorageService.saveTasks(this.tasks);
      this.confetti.fire();

      ToastService.show('All Tasks Completed!', `Marked ${pendingCount} pending task(s) as complete!`, 'success', 3500);
      this.render();
    }

    promptDeleteAll() {
      if (this.tasks.length === 0) {
        ToastService.show('No Tasks to Delete', 'Your task list is already empty.', 'info', 2000);
        return;
      }

      this.dom.confirmModalTitle.textContent = 'Delete ALL Tasks?';
      this.dom.confirmModalMessage.textContent = `WARNING: This will permanently delete all ${this.tasks.length} tasks in your workspace. This cannot be undone.`;

      this.pendingConfirmAction = () => {
        this.tasks = [];
        StorageService.saveTasks(this.tasks);
        ToastService.show('Workspace Cleared', 'All tasks have been deleted.', 'error', 3000);
        this.render();
      };

      this.openConfirmModal();
    }

    /* ------------------------------------------------------------------------
       Task Modal (Add & Edit) Form Handling
       ------------------------------------------------------------------------ */
    openTaskModal(task = null) {
      this.activeEditingTaskId = task ? task.id : null;

      if (task) {
        // Edit mode
        this.dom.taskModalTitle.textContent = 'Edit Task';
        this.dom.taskModalSubtitle.textContent = 'Update the parameters and milestones for this task.';
        this.dom.btnSubmitTaskText.textContent = 'Save Changes';
        this.dom.modalIconAdd.classList.add('hidden');
        this.dom.modalIconEdit.classList.remove('hidden');

        this.dom.taskIdInput.value = task.id;
        this.dom.taskTitleInput.value = task.title;
        this.dom.taskDescriptionInput.value = task.description || '';
        this.dom.taskCategorySelect.value = task.category || 'work';
        this.dom.taskDueDateInput.value = task.dueDate || '';

        const priorityRadio = this.dom.taskForm.querySelector(`input[name="taskPriority"][value="${task.priority}"]`);
        if (priorityRadio) priorityRadio.checked = true;
      } else {
        // Create mode
        this.dom.taskModalTitle.textContent = 'Create New Task';
        this.dom.taskModalSubtitle.textContent = 'Fill in the details below to organize your workflow.';
        this.dom.btnSubmitTaskText.textContent = 'Create Task';
        this.dom.modalIconAdd.classList.remove('hidden');
        this.dom.modalIconEdit.classList.add('hidden');

        this.dom.taskForm.reset();
        this.dom.taskIdInput.value = '';

        const lowRadio = this.dom.taskForm.querySelector('input[name="taskPriority"][value="low"]');
        if (lowRadio) lowRadio.checked = true;
      }

      this.dom.titleCharCount.textContent = `${this.dom.taskTitleInput.value.length} / 80`;
      this.dom.descCharCount.textContent = `${this.dom.taskDescriptionInput.value.length} / 300`;
      this.dom.titleErrorMsg.classList.add('hidden');

      this.dom.taskModal.classList.remove('hidden');
      setTimeout(() => this.dom.taskTitleInput.focus(), 80);
    }

    closeTaskModal() {
      this.dom.taskModal.classList.add('hidden');
      this.activeEditingTaskId = null;
    }

    handleTitleInput() {
      const val = this.dom.taskTitleInput.value;
      this.dom.titleCharCount.textContent = `${val.length} / 80`;
      if (val.trim()) {
        this.dom.titleErrorMsg.classList.add('hidden');
      }
    }

    setDuePreset(preset) {
      const now = new Date();
      let target = new Date();

      if (preset === 'today') {
        target.setHours(18, 0, 0, 0); // Today 6 PM
      } else if (preset === 'tomorrow') {
        target.setDate(now.getDate() + 1);
        target.setHours(18, 0, 0, 0);
      } else if (preset === 'nextWeek') {
        target.setDate(now.getDate() + 7);
        target.setHours(9, 0, 0, 0);
      }

      // Convert local date to datetime-local string
      const year = target.getFullYear();
      const month = String(target.getMonth() + 1).padStart(2, '0');
      const day = String(target.getDate()).padStart(2, '0');
      const hours = String(target.getHours()).padStart(2, '0');
      const minutes = String(target.getMinutes()).padStart(2, '0');

      this.dom.taskDueDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    handleTaskFormSubmit(e) {
      e.preventDefault();

      const title = this.dom.taskTitleInput.value.trim();
      const description = this.dom.taskDescriptionInput.value.trim();
      const category = this.dom.taskCategorySelect.value;
      const dueDate = this.dom.taskDueDateInput.value;

      const priorityChecked = this.dom.taskForm.querySelector('input[name="taskPriority"]:checked');
      const priority = priorityChecked ? priorityChecked.value : 'low';

      // Validation
      if (!title) {
        this.dom.titleErrorMsg.classList.remove('hidden');
        this.dom.taskTitleInput.focus();
        return;
      }

      if (this.activeEditingTaskId) {
        // Update existing task
        const task = this.tasks.find(t => t.id === this.activeEditingTaskId);
        if (task) {
          task.title = title;
          task.description = description;
          task.category = category;
          task.priority = priority;
          task.dueDate = dueDate;
          task.updatedAt = new Date().toISOString();

          StorageService.saveTasks(this.tasks);
          ToastService.show('Task Updated', `"${title}" has been saved.`, 'success', 2500);
        }
      } else {
        // Create new task
        const newTask = {
          id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          title,
          description,
          category,
          priority,
          dueDate,
          completed: false,
          pinned: false,
          createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        StorageService.saveTasks(this.tasks);
        ToastService.show('Task Created!', `"${title}" was added to your workspace.`, 'success', 2500);
      }

      this.closeTaskModal();
      this.render();
    }

    /* ------------------------------------------------------------------------
       Confirmation Dialog
       ------------------------------------------------------------------------ */
    openConfirmModal() {
      this.dom.confirmModal.classList.remove('hidden');
      this.dom.btnAcceptConfirm.focus();
    }

    closeConfirmModal() {
      this.dom.confirmModal.classList.add('hidden');
      this.pendingConfirmAction = null;
    }

    /* ------------------------------------------------------------------------
       Shortcuts Dialog
       ------------------------------------------------------------------------ */
    openShortcutsModal() {
      this.dom.shortcutsModal.classList.remove('hidden');
    }

    closeShortcutsModal() {
      this.dom.shortcutsModal.classList.add('hidden');
    }

    /* ------------------------------------------------------------------------
       Date & Formatting Helpers
       ------------------------------------------------------------------------ */
    formatDueDate(dueStr, isCompleted) {
      if (!dueStr) return null;

      const dueDate = new Date(dueStr);
      if (isNaN(dueDate.getTime())) return null;

      const now = new Date();
      const diffMs = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const timeFormatted = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateFormatted = dueDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

      if (isCompleted) {
        return {
          shortText: dateFormatted,
          fullText: `Due: ${dateFormatted} at ${timeFormatted}`,
          statusClass: 'completed'
        };
      }

      if (diffMs < 0) {
        return {
          shortText: `Overdue (${dateFormatted})`,
          fullText: `Was due ${dateFormatted} at ${timeFormatted}`,
          statusClass: 'overdue'
        };
      } else if (diffDays === 0 || (dueDate.toDateString() === now.toDateString())) {
        return {
          shortText: `Today at ${timeFormatted}`,
          fullText: `Due Today at ${timeFormatted}`,
          statusClass: 'today'
        };
      } else if (diffDays === 1) {
        return {
          shortText: `Tomorrow at ${timeFormatted}`,
          fullText: `Due Tomorrow at ${timeFormatted}`,
          statusClass: 'upcoming'
        };
      } else {
        return {
          shortText: `${dateFormatted}`,
          fullText: `Due on ${dateFormatted} at ${timeFormatted}`,
          statusClass: 'upcoming'
        };
      }
    }

    formatRelativeTime(isoStr) {
      if (!isoStr) return 'recently';
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return 'recently';

      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);

      if (diffSec < 60) return 'just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;

      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    getCategoryEmoji(category) {
      switch (category) {
        case 'work': return '💼';
        case 'personal': return '🏠';
        case 'study': return '📚';
        case 'finance': return '💰';
        case 'health': return '🏋️';
        case 'other':
        default: return '✨';
      }
    }

    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // Initialize application on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    window.auraTaskApp = new AuraTaskApp();
  });
})();
