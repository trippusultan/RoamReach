export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_unread: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_unread?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_unread?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_attendees: {
        Row: {
          joined_at: string
          plan_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          plan_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          plan_id?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          attendee_ids: string[] | null
          category: string
          city: string
          country_code: string
          created_at: string
          date: string
          description: string | null
          host_id: string
          id: string
          is_full: boolean | null
          is_hot: boolean | null
          max_spots: number
          meeting_point: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          attendee_ids?: string[] | null
          category: string
          city: string
          country_code?: string
          created_at?: string
          date: string
          description?: string | null
          host_id: string
          id: string
          is_full?: boolean | null
          is_hot?: boolean | null
          max_spots: number
          meeting_point: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          attendee_ids?: string[] | null
          category?: string
          city?: string
          country_code?: string
          created_at?: string
          date?: string
          description?: string | null
          host_id?: string
          id?: string
          is_full?: boolean | null
          is_hot?: boolean | null
          max_spots?: number
          meeting_point?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          countries_visited: number | null
          country_code: string | null
          cover_photo_url: string | null
          created_at: string
          email: string | null
          home_city: string | null
          id: string
          is_verified: boolean | null
          journey_images: string[] | null
          name: string | null
          reputation_score: number | null
          total_ratings: number | null
          travel_styles: string[] | null
          travelling_months: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          countries_visited?: number | null
          country_code?: string | null
          cover_photo_url?: string | null
          created_at?: string
          email?: string | null
          home_city?: string | null
          id: string
          is_verified?: boolean | null
          journey_images?: string[] | null
          name?: string | null
          reputation_score?: number | null
          total_ratings?: number | null
          travel_styles?: string[] | null
          travelling_months?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          countries_visited?: number | null
          country_code?: string | null
          cover_photo_url?: string | null
          created_at?: string
          email?: string | null
          home_city?: string | null
          id?: string
          is_verified?: boolean | null
          journey_images?: string[] | null
          name?: string | null
          reputation_score?: number | null
          total_ratings?: number | null
          travel_styles?: string[] | null
          travelling_months?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_plan: {
        Args: { plan_id: string; user_id: string }
        Returns: undefined
      }
      leave_plan: {
        Args: { plan_id: string; user_id: string }
        Returns: undefined
      }
      send_notification: {
        Args: {
          p_body: string
          p_data?: Json
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
