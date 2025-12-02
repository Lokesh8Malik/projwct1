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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alumni_posts: {
        Row: {
          alumni_id: string | null
          approved: boolean | null
          company: string
          content: string
          difficulty_rating: number | null
          id: string
          posted_at: string | null
          role: string
          rounds: Json | null
          tips: string[] | null
          updated_at: string | null
        }
        Insert: {
          alumni_id?: string | null
          approved?: boolean | null
          company: string
          content: string
          difficulty_rating?: number | null
          id?: string
          posted_at?: string | null
          role: string
          rounds?: Json | null
          tips?: string[] | null
          updated_at?: string | null
        }
        Update: {
          alumni_id?: string | null
          approved?: boolean | null
          company?: string
          content?: string
          difficulty_rating?: number | null
          id?: string
          posted_at?: string | null
          role?: string
          rounds?: Json | null
          tips?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_posts_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          id: string
          internship_id: string | null
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          internship_id?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          internship_id?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          internship_id: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          internship_id?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          internship_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          company: string
          created_at: string | null
          deadline: string
          description: string
          eligibility: string | null
          id: string
          location: string
          mode: string
          posted_by: string | null
          status: Database["public"]["Enums"]["internship_status"] | null
          stipend: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          deadline: string
          description: string
          eligibility?: string | null
          id?: string
          location: string
          mode: string
          posted_by?: string | null
          status?: Database["public"]["Enums"]["internship_status"] | null
          stipend?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          deadline?: string
          description?: string
          eligibility?: string | null
          id?: string
          location?: string
          mode?: string
          posted_by?: string | null
          status?: Database["public"]["Enums"]["internship_status"] | null
          stipend?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internships_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          batch: string | null
          branch: string | null
          created_at: string | null
          email: string
          full_name: string
          github_url: string | null
          id: string
          is_alumni_verified: boolean | null
          linkedin_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          roll_no: string | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          batch?: string | null
          branch?: string | null
          created_at?: string | null
          email: string
          full_name: string
          github_url?: string | null
          id: string
          is_alumni_verified?: boolean | null
          linkedin_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          roll_no?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          batch?: string | null
          branch?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          github_url?: string | null
          id?: string
          is_alumni_verified?: boolean | null
          linkedin_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          roll_no?: string | null
          skills?: string[] | null
          updated_at?: string | null
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
      application_status: "submitted" | "under_review" | "selected" | "rejected"
      internship_status: "open" | "closed" | "draft"
      notification_type:
        | "new_internship"
        | "deadline_alert"
        | "status_update"
        | "post_approved"
        | "general"
      user_role: "student" | "alumni" | "admin"
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
      application_status: ["submitted", "under_review", "selected", "rejected"],
      internship_status: ["open", "closed", "draft"],
      notification_type: [
        "new_internship",
        "deadline_alert",
        "status_update",
        "post_approved",
        "general",
      ],
      user_role: ["student", "alumni", "admin"],
    },
  },
} as const
