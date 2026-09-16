export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
}

export interface GroupSummary {
  id: string;
  name: string;
  currency: string;
  createdById: string;
  createdAt: string;
  members: { userId: string }[];
}

export interface GroupMemberInfo {
  userId: string;
  user: { id: string; fullName: string; email: string };
  joinedAt: string;
}

export interface ExpenseSplitInfo {
  id: string;
  userId: string;
  user: { id: string; fullName: string };
  shareAmount: string;
}

export interface ExpenseInfo {
  id: string;
  description: string;
  amount: string;
  paidById: string;
  paidBy: { id: string; fullName: string };
  splits: ExpenseSplitInfo[];
  createdAt: string;
}

export interface PaymentInfo {
  id: string;
  fromUserId: string;
  fromUser: { id: string; fullName: string };
  toUserId: string;
  toUser: { id: string; fullName: string };
  amount: string;
  settledAt: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  currency: string;
  createdById: string;
  members: GroupMemberInfo[];
  expenses: ExpenseInfo[];
  payments: PaymentInfo[];
}

export interface Balance {
  userId: string;
  balance: number;
}

export interface Settlement {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export interface GroupDetailResponse {
  group: GroupDetail;
  balances: Balance[];
  settlements: Settlement[];
}
