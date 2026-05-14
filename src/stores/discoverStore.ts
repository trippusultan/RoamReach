import { create } from 'zustand';
import { Backpacker, MOCK_BACKPACKERS } from '../data/mockData';
import { TravelStyle } from '../constants/travelStyles';
import { haversineDistance } from '../utils/haversine';

interface DiscoverState {
  backpackers: Backpacker[];
  viewMode: 'map' | 'list';
  filterStyle: TravelStyle | null;
  selectedBackpackerId: string | null;

  setViewMode: (mode: 'map' | 'list') => void;
  setFilterStyle: (style: TravelStyle | null) => void;
  selectBackpacker: (id: string | null) => void;
  getFilteredBackpackers: () => Backpacker[];
  getSortedByDistance: (lat: number, lon: number) => (Backpacker & { distance: number })[];
}

export const useDiscoverStore = create<DiscoverState>((set, get) => ({
  backpackers: MOCK_BACKPACKERS,
  viewMode: 'map',
  filterStyle: null,
  selectedBackpackerId: null,

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilterStyle: (style) =>
    set((state) => ({
      filterStyle: state.filterStyle === style ? null : style,
    })),

  selectBackpacker: (id) => set({ selectedBackpackerId: id }),

  getFilteredBackpackers: () => {
    const { backpackers, filterStyle } = get();
    if (!filterStyle) return backpackers;
    return backpackers.filter((bp) => bp.travelStyles.includes(filterStyle));
  },

  getSortedByDistance: (lat, lon) => {
    const filtered = get().getFilteredBackpackers();
    return filtered
      .map((bp) => ({
        ...bp,
        distance: haversineDistance(lat, lon, bp.latitude, bp.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);
  },
}));
