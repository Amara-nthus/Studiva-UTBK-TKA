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
      daily_quiz: {
        Row: {
          answer_index: number
          created_at: string
          explanation: string
          id: string
          options: Json
          question: string
          quiz_date: string
          subject: string
        }
        Insert: {
          answer_index: number
          created_at?: string
          explanation: string
          id?: string
          options: Json
          question: string
          quiz_date: string
          subject: string
        }
        Update: {
          answer_index?: number
          created_at?: string
          explanation?: string
          id?: string
          options?: Json
          question?: string
          quiz_date?: string
          subject?: string
        }
        Relationships: []
      }
      daily_quiz_attempts: {
        Row: {
          answered_at: string
          chosen_index: number
          id: string
          is_correct: boolean
          quiz_id: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          chosen_index: number
          id?: string
          is_correct: boolean
          quiz_id: string
          user_id: string
        }
        Update: {
          answered_at?: string
          chosen_index?: number
          id?: string
          is_correct?: boolean
          quiz_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "daily_quiz"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back: string
          front: string
          id: string
          note_id: string
          position: number
          user_id: string
        }
        Insert: {
          back: string
          front: string
          id?: string
          note_id: string
          position?: number
          user_id: string
        }
        Update: {
          back?: string
          front?: string
          id?: string
          note_id?: string
          position?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          body: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      note_quiz: {
        Row: {
          answer_index: number
          explanation: string
          id: string
          note_id: string
          options: Json
          position: number
          question: string
          user_id: string
        }
        Insert: {
          answer_index: number
          explanation: string
          id?: string
          note_id: string
          options: Json
          position?: number
          question: string
          user_id: string
        }
        Update: {
          answer_index?: number
          explanation?: string
          id?: string
          note_id?: string
          options?: Json
          position?: number
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_quiz_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string
          id: string
          image_path: string
          mime_type: string | null
          status: Database["public"]["Enums"]["note_status"]
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          mime_type?: string | null
          status?: Database["public"]["Enums"]["note_status"]
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          mime_type?: string | null
          status?: Database["public"]["Enums"]["note_status"]
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          school: string | null
          target_major: string | null
          target_university: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          school?: string | null
          target_major?: string | null
          target_university?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          school?: string | null
          target_major?: string | null
          target_university?: string | null
        }
        Relationships: []
      }
      psikotes_results: {
        Row: {
          answers: Json
          created_at: string
          id: string
          recommendations: Json
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          recommendations: Json
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          recommendations?: Json
          user_id?: string
        }
        Relationships: []
      }
      simulation_questions: {
        Row: {
          answer_index: number
          created_at: string
          explanation: string | null
          id: string
          options: Json
          position: number
          question: string
          section: string
          simulation_id: string
          user_id: string
        }
        Insert: {
          answer_index: number
          created_at?: string
          explanation?: string | null
          id?: string
          options: Json
          position: number
          question: string
          section: string
          simulation_id: string
          user_id: string
        }
        Update: {
          answer_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          position?: number
          question?: string
          section?: string
          simulation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_questions_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          id: string
          score: number
          taken_at: string
          type: Database["public"]["Enums"]["simulation_type"]
          user_id: string
        }
        Insert: {
          id?: string
          score: number
          taken_at?: string
          type: Database["public"]["Enums"]["simulation_type"]
          user_id: string
        }
        Update: {
          id?: string
          score?: number
          taken_at?: string
          type?: Database["public"]["Enums"]["simulation_type"]
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string
          duration_seconds: number
          ended_at: string | null
          id: string
          session_date: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          session_date?: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          session_date?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          exp: number
          last_quiz_date: string | null
          snbt_best: number
          streak_current: number
          streak_longest: number
          tka_best: number
          updated_at: string
          user_id: string
        }
        Insert: {
          exp?: number
          last_quiz_date?: string | null
          snbt_best?: number
          streak_current?: number
          streak_longest?: number
          tka_best?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          exp?: number
          last_quiz_date?: string | null
          snbt_best?: number
          streak_current?: number
          streak_longest?: number
          tka_best?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weakness_reports: {
        Row: {
          attempt_id: string | null
          created_at: string
          id: string
          kind: string
          payload: Json
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string
          id?: string
          kind: string
          payload: Json
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          payload?: Json
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      note_status: "processing" | "ready" | "failed"
      simulation_type: "snbt" | "tka"
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
    Enums: {
      note_status: ["processing", "ready", "failed"],
      simulation_type: ["snbt", "tka"],
    },
  },
} as const
