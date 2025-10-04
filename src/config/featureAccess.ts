export const normalizeFeatureName = (name?: string) =>
  (name || "").trim().toLowerCase();

export const PLAN_ALLOWED_FEATURES: Record<string, string[]> = {
  GROWTH: [
    "attendance management",
    "attendance",
    "leave management",
    "branch management",
    "department management",
    "payroll",
    "employee management",
    "employee benefit",
    "onboarding",
    "reimbursement",
    "query management",
    "loan management",
    "expense management",
    "financial reporting",
    "bill payment",
    "sms marketing",
    "bookkeeping",
    "inventory management",
    "vendor management",
    "procurement management",
    "events",
    "all purchase expenses",
    "all procurement",
    "all reimbursement",
    "task management",

    "approval",
  ],
  PREMIUM: [
    "dashboard",
    "leave management",
    "attendance",
    "expense management",
    "payroll",
    "employee management",
    "procurement",
    "event",
    "query management",
    "task management",
    "asset management",
    "loan management",
    "appraisals",
    "message",
    "onboarding documents",
    "approval",
    "settings",
    "benefit management",
    "bill payment",
  ],
};

export const ALWAYS_AVAILABLE_FEATURES = new Set([
  "dashboard",
  "settings",
  "bill payment",
]);

export const SIDEBAR_FEATURE_MAP: Record<string, string[]> = {
  Dashboard: ["dashboard"],
  "Leave Management": ["leave management"],
  Attendance: ["attendance", "attendance management"],
  "Expense Management": ["expense management", "all purchase expenses"],
  Payroll: ["payroll"],
  "Employee Management": ["employee management"],
  Procurement: [
    "procurement management",
    "vendor management",
    "all procurement",
  ],
  Event: ["events"],
  "Query Management": ["query management"],
  "Task Management": ["task management"],
  "Asset Management": ["asset management", "inventory management"],
  "Loan Management": ["loan management"],
  Appraisals: ["appraisals"],
  Message: ["message", "messages", "chat"],
  "Onboarding Documents": ["onboarding"],
  Approval: [
    "approval",
    "approvals",

    "payroll",
    "loan management",
    "expense management",
    "reimbursement",
    "procurement management",
  ],
  Settings: ["settings"],
  "Benefit Management": ["employee benefit"],
  "Bill Payment": ["bill payment"],
  Wallet: ["wallet"],
  "All Expenses": ["all purchase expenses"],
};

export const isFeatureAllowedByPlan = (
  plan: string | undefined,
  featureTitle: string
) => {
  if (!featureTitle) return false;
  const normalized = normalizeFeatureName(featureTitle);
  if (ALWAYS_AVAILABLE_FEATURES.has(normalized)) return true;
  // Optimistic allow before plan load
  if (!plan) return true;
  const upper = plan.toUpperCase();
  const allowed = PLAN_ALLOWED_FEATURES[upper];
  if (!allowed) return true;
  if (allowed.includes(normalized)) return true;

  for (const [sidebarTitle, variants] of Object.entries(SIDEBAR_FEATURE_MAP)) {
    if (normalizeFeatureName(sidebarTitle) === normalized) {
      if (variants.some((v) => allowed.includes(normalizeFeatureName(v)))) {
        return true;
      }
    }
  }
  return false;
};

export const hasBackendFeature = (
  sidebarTitle: string,
  backendFeatureSet: Set<string>
) => {
  const mapped = SIDEBAR_FEATURE_MAP[sidebarTitle];
  const normalizedTitle = normalizeFeatureName(sidebarTitle);
  if (ALWAYS_AVAILABLE_FEATURES.has(normalizedTitle)) return true;
  if (!mapped) return true;
  if (!backendFeatureSet || backendFeatureSet.size === 0) return true;
  const normalized = mapped.map((m) => normalizeFeatureName(m));
  return normalized.some((m) => backendFeatureSet.has(m));
};
