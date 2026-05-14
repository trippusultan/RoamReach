import { create } from 'zustand';

export interface ReportData {
  targetId: string;
  targetType: 'profile' | 'plan';
  reason: string;
  details: string;
  timestamp: string;
}

interface SocialState {
  connections: string[];
  pendingRequests: string[];
  blockedUsers: string[];
  reports: ReportData[];

  sendRequest: (userId: string) => void;
  acceptRequest: (userId: string) => void;
  removeConnection: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (data: ReportData) => void;
  isConnected: (userId: string) => boolean;
  isBlocked: (userId: string) => boolean;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  connections: ['bp-01', 'bp-02', 'bp-05'],
  pendingRequests: ['bp-07'],
  blockedUsers: [],
  reports: [],

  sendRequest: (userId) =>
    set((state) => ({
      pendingRequests: [...state.pendingRequests, userId],
    })),

  acceptRequest: (userId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((id) => id !== userId),
      connections: [...state.connections, userId],
    })),

  removeConnection: (userId) =>
    set((state) => ({
      connections: state.connections.filter((id) => id !== userId),
    })),

  blockUser: (userId) =>
    set((state) => ({
      blockedUsers: [...state.blockedUsers, userId],
      connections: state.connections.filter((id) => id !== userId),
      pendingRequests: state.pendingRequests.filter((id) => id !== userId),
    })),

  unblockUser: (userId) =>
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((id) => id !== userId),
    })),

  reportUser: (data) =>
    set((state) => ({
      reports: [...state.reports, data],
    })),

  isConnected: (userId) => get().connections.includes(userId),
  isBlocked: (userId) => get().blockedUsers.includes(userId),
}));
