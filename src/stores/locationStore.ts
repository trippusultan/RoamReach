import { create } from 'zustand';

interface LocationState {
  currentCity: string;
  latitude: number;
  longitude: number;
  isCheckedIn: boolean;
  isInvisible: boolean;
  recentCities: string[];
  locationPermission: 'granted' | 'denied' | 'undetermined';

  checkIn: (city: string, lat: number, lon: number) => void;
  checkOut: () => void;
  toggleInvisible: () => void;
  setPermission: (status: 'granted' | 'denied' | 'undetermined') => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentCity: '',
  latitude: 12.9716, // Bangalore default
  longitude: 77.5946,
  isCheckedIn: false,
  isInvisible: false,
  recentCities: ['Bangkok', 'Chiang Mai', 'Goa'],
  locationPermission: 'undetermined',

  checkIn: (city, lat, lon) =>
    set((state) => {
      const recent = [city, ...state.recentCities.filter((c) => c !== city)].slice(0, 3);
      return {
        currentCity: city,
        latitude: lat,
        longitude: lon,
        isCheckedIn: true,
        isInvisible: false,
        recentCities: recent,
      };
    }),

  checkOut: () =>
    set({
      isCheckedIn: false,
      isInvisible: false,
    }),

  toggleInvisible: () =>
    set((state) => ({
      isInvisible: !state.isInvisible,
    })),

  setPermission: (status) => set({ locationPermission: status }),
}));
