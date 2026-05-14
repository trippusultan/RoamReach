export type PlanCategory = 'food' | 'explore' | 'nightlife' | 'culture' | 'other';

export interface CategoryConfig {
  id: PlanCategory;
  label: string;
  icon: string;
  emoji: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'food', label: 'Food', icon: 'restaurant', emoji: '🍜' },
  { id: 'explore', label: 'Explore', icon: 'compass', emoji: '🧭' },
  { id: 'nightlife', label: 'Nightlife', icon: 'moon', emoji: '🌙' },
  { id: 'culture', label: 'Culture', icon: 'library', emoji: '🏛' },
  { id: 'other', label: 'Other', icon: 'sparkles', emoji: '✨' },
];

export const getCategoryConfig = (id: PlanCategory): CategoryConfig =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[4];
