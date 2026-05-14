export type TravelStyle =
  | 'adventure'
  | 'food'
  | 'budget'
  | 'social'
  | 'photography'
  | 'nomadic'
  | 'sustainable'
  | 'luxury'
  | 'solo'
  | 'culture';

export interface TravelStyleConfig {
  id: TravelStyle;
  label: string;
  emoji: string;
}

export const TRAVEL_STYLES: TravelStyleConfig[] = [
  { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'budget', label: 'Budget', emoji: '💰' },
  { id: 'social', label: 'Social', emoji: '🎉' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'nomadic', label: 'Nomadic', emoji: '🎒' },
  { id: 'sustainable', label: 'Sustainable', emoji: '🌿' },
  { id: 'luxury', label: 'Luxury', emoji: '✨' },
  { id: 'solo', label: 'Solo', emoji: '🧘' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
];
