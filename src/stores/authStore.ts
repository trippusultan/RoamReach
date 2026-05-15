import { create } from 'zustand';
import { TravelStyle } from '../constants/travelStyles';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  coverPhoto: string | null;
  countryCode: string;
  homeCity: string;
  bio: string;
  travelStyles: TravelStyle[];
  countriesVisited: number;
  travellingMonths: number;
  reputationScore: number;
  totalRatings: number;
  isVerified: boolean;
  journeyImages?: string[];
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  signIn: (email?: string, password?: string) => Promise<void>;
  signInWithOAuth: (provider?: 'google' | 'apple', redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (profile?: Partial<UserProfile>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('your-project'));
};

const mapProfile = (db: any): UserProfile => ({
  id: db.id,
  name: db.name || 'Traveler',
  email: db.id,
  avatar: db.avatar_url,
  coverPhoto: null,
  countryCode: db.country_code || 'US',
  homeCity: db.home_city || 'Unknown',
  bio: db.bio || '',
  travelStyles: (db.travel_styles as TravelStyle[]) || [],
  countriesVisited: db.countries_visited || 0,
  travellingMonths: db.travelling_months || 0,
  reputationScore: db.reputation_score || 0,
  totalRatings: db.total_ratings || 0,
  isVerified: db.is_verified || false,
  journeyImages: [],
});

export const useAuthStore = create<AuthState>((set, get) => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    isLoading: true,
  };

  // Async init
  (async () => {
    if (!isSupabaseConfigured()) {
      // Mock default user
      set({
        user: {
          id: 'user-me',
          name: 'Alex Mercer',
          email: 'alex@roamreach.io',
          avatar: null,
          coverPhoto: null,
          countryCode: 'US',
          homeCity: 'San Francisco',
          bio: '',
          travelStyles: ['adventure'],
          countriesVisited: 1,
          travellingMonths: 1,
          reputationScore: 5,
          totalRatings: 0,
          isVerified: true,
          journeyImages: [],
        },
        isAuthenticated: true,
        isOnboarded: true,
        isLoading: false,
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (error) throw error;
        set({ user: mapProfile(data), isAuthenticated: true, isLoading: false });
      } else {
        set({ ...initialState, isLoading: false });
      }
    } catch (error) {
      set({ ...initialState, isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Ensure profile row exists (create stub from OAuth metadata)
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!existing) {
          const meta = session.user.user_metadata || {};
          await supabase.from('profiles').insert({
            id: session.user.id,
            name: meta.full_name || meta.name || 'Traveler',
            email: session.user.email || '',
            avatar_url: meta.avatar_url || null,
            city: '',
            country_code: 'US',
            current_city: '',
            is_verified: false,
            rating: 0,
            followers_count: 0,
          } as any);
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (error) {
          set({ user: null, isAuthenticated: true, isOnboarded: false, isLoading: false });
        } else {
          set({ user: mapProfile(data), isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isOnboarded: false, isLoading: false });
      }
    });
  })();

  return {
    ...initialState,
    signIn: async (email?: string, password?: string) => {
      if (isSupabaseConfigured()) {
        set({ isLoading: true });
        if (email && password) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else {
          // OAuth redirect handled by sign-in screen useEffect + onAuthStateChange
          await get().signInWithOAuth('google');
        }
      } else {
        // Mock
        set({
          user: {
            id: 'user-me',
            name: 'Alex Mercer',
            email: email || 'alex@roamreach.io',
            avatar: null,
            coverPhoto: null,
            countryCode: 'US',
            homeCity: 'San Francisco',
            bio: '',
            travelStyles: ['adventure'],
            countriesVisited: 1,
            travellingMonths: 1,
            reputationScore: 5,
            totalRatings: 0,
            isVerified: true,
            journeyImages: [],
          },
          isAuthenticated: true,
          isOnboarded: true,
          isLoading: false,
        });
      }
    },
    signInWithOAuth: async (provider: 'google' | 'apple' = 'google', redirectTo?: string) => {
      if (isSupabaseConfigured()) {
        set({ isLoading: true });
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: redirectTo ? { redirectTo } : undefined,
        });
        if (error) throw error;
      } else {
        // Mock
        set({
          user: {
            id: 'user-me',
            name: 'Alex Mercer',
            email: 'alex@roamreach.io',
            avatar: null,
            coverPhoto: null,
            countryCode: 'US',
            homeCity: 'San Francisco',
            bio: '',
            travelStyles: ['adventure'],
            countriesVisited: 1,
            travellingMonths: 1,
            reputationScore: 5,
            totalRatings: 0,
            isVerified: true,
            journeyImages: [],
          },
          isAuthenticated: true,
          isOnboarded: true,
          isLoading: false,
        });
      }
    },
    signOut: async () => {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      set({ user: null, isAuthenticated: false, isOnboarded: false });
    },
    completeOnboarding: async (profileData?: Partial<UserProfile>) => {
      if (isSupabaseConfigured()) {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (!userId) throw new Error('Not authenticated');

        const defaults = {
          name: 'Traveler',
          home_city: 'Unknown',
          country_code: 'US',
          travel_styles: [] as string[],
          countries_visited: 0,
          travelling_months: 0,
          reputation_score: 0,
          total_ratings: 0,
          is_verified: false,
        };

        const { data, error } = await supabase
          .from('profiles')
          .insert({ id: userId, ...defaults, ...profileData } as any)
          .select()
          .single();

        if (error) throw error;
        set({ user: mapProfile(data), isOnboarded: true, isLoading: false });
      } else {
        set({
          user: {
            id: 'user-me',
            name: 'Alex Mercer',
            email: 'alex@roamreach.io',
            avatar: null,
            coverPhoto: null,
            countryCode: 'US',
            homeCity: 'San Francisco',
            bio: '',
            travelStyles: ['adventure'],
            countriesVisited: 1,
            travellingMonths: 1,
            reputationScore: 5,
            totalRatings: 0,
            isVerified: true,
            journeyImages: [],
          },
          isAuthenticated: true,
          isOnboarded: true,
          isLoading: false,
        });
      }
    },
    updateProfile: async (updates: Partial<UserProfile>) => {
      if (isSupabaseConfigured()) {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (!userId) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('profiles')
                    .update(updates as any)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        set({ user: mapProfile(data) });
      } else {
        // Mock
        set({ user: { ...get().user!, ...updates } });
      }
    },
  };
});
