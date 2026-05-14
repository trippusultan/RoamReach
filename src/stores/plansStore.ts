import { create } from 'zustand';
import { Plan, MOCK_PLANS } from '../data/mockData';
import { PlanCategory } from '../constants/categories';

interface PlansState {
  plans: Plan[];
  filterCategory: PlanCategory | null;

  setFilterCategory: (cat: PlanCategory | null) => void;
  getFilteredPlans: () => Plan[];
  joinPlan: (planId: string, userId: string) => { success: boolean; message: string };
  leavePlan: (planId: string, userId: string) => void;
  createPlan: (plan: Omit<Plan, 'id' | 'createdAt'>) => Plan;
  getPlanById: (id: string) => Plan | undefined;
  isFull: (planId: string) => boolean;
  isHot: (planId: string) => boolean;
}

export const usePlansStore = create<PlansState>((set, get) => ({
  plans: MOCK_PLANS,
  filterCategory: null,

  setFilterCategory: (cat) =>
    set((state) => ({
      filterCategory: state.filterCategory === cat ? null : cat,
    })),

  getFilteredPlans: () => {
    const { plans, filterCategory } = get();
    if (!filterCategory) return plans;
    return plans.filter((p) => p.category === filterCategory);
  },

  joinPlan: (planId, userId) => {
    const plan = get().plans.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Plan not found' };
    if (plan.attendeeIds.includes(userId))
      return { success: false, message: 'Already joined' };
    if (plan.attendeeIds.length >= plan.maxSpots)
      return { success: false, message: 'Plan just became full' };

    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId
          ? { ...p, attendeeIds: [...p.attendeeIds, userId] }
          : p
      ),
    }));
    return { success: true, message: 'You\'re in!' };
  },

  leavePlan: (planId, userId) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId
          ? { ...p, attendeeIds: p.attendeeIds.filter((id) => id !== userId) }
          : p
      ),
    })),

  createPlan: (planData) => {
    const newPlan: Plan = {
      ...planData,
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ plans: [newPlan, ...state.plans] }));
    return newPlan;
  },

  getPlanById: (id) => get().plans.find((p) => p.id === id),

  isFull: (planId) => {
    const plan = get().plans.find((p) => p.id === planId);
    return plan ? plan.attendeeIds.length >= plan.maxSpots : false;
  },

  isHot: (planId) => {
    const plan = get().plans.find((p) => p.id === planId);
    return plan ? plan.attendeeIds.length / plan.maxSpots > 2 / 3 : false;
  },
}));
