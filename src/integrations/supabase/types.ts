export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_access: {
        Row: {
          app_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string
        }
        Insert: {
          id: string
          username: string
        }
        Update: {
          id?: string
          username?: string
        }
        Relationships: []
      }
      school_visits: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_out: boolean
          id: string
          school_name: string
          student_count: number
          teacher_name: string
          visiting: string | null
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          id?: string
          school_name: string
          student_count: number
          teacher_name: string
          visiting?: string | null
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          id?: string
          school_name?: string
          student_count?: number
          teacher_name?: string
          visiting?: string | null
        }
        Relationships: []
      }
      user_machines: {
        Row: {
          machine: string
          user_id: string
        }
        Insert: {
          machine: string
          user_id: string
        }
        Update: {
          machine?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_machines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verktygsbyte: {
        Row: {
          anledning: string | null
          id: string
          kommentar: string | null
          maskin: string
          signatur: string | null
          tid: string
          tillverkningsorder: string | null
          verktyg: string | null
        }
        Insert: {
          anledning?: string | null
          id?: string
          kommentar?: string | null
          maskin: string
          signatur?: string | null
          tid?: string
          tillverkningsorder?: string | null
          verktyg?: string | null
        }
        Update: {
          anledning?: string | null
          id?: string
          kommentar?: string | null
          maskin?: string
          signatur?: string | null
          tid?: string
          tillverkningsorder?: string | null
          verktyg?: string | null
        }
        Relationships: []
      }
      verktygskompensering: {
        Row: {
          id: string
          kommentar: string | null
          koordinatsystem: string | null
          maskin: string
          nummer: string | null
          riktning: string | null
          signatur: string | null
          tid: string
          tillverkningsorder: string | null
          varde: string | null
          verktyg: string | null
        }
        Insert: {
          id?: string
          kommentar?: string | null
          koordinatsystem?: string | null
          maskin: string
          nummer?: string | null
          riktning?: string | null
          signatur?: string | null
          tid?: string
          tillverkningsorder?: string | null
          varde?: string | null
          verktyg?: string | null
        }
        Update: {
          id?: string
          kommentar?: string | null
          koordinatsystem?: string | null
          maskin?: string
          nummer?: string | null
          riktning?: string | null
          signatur?: string | null
          tid?: string
          tillverkningsorder?: string | null
          varde?: string | null
          verktyg?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_out: boolean
          company: string
          id: string
          is_service_personnel: boolean | null
          name: string
          visiting: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company: string
          id?: string
          is_service_personnel?: boolean | null
          name: string
          visiting: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company?: string
          id?: string
          is_service_personnel?: boolean | null
          name?: string
          visiting?: string
        }
        Relationships: []
      }
      visitors_dupe: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_out: boolean
          company: string
          id: string
          is_service_personnel: boolean | null
          name: string
          students: number | null
          type: string | null
          visiting: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company: string
          id?: string
          is_service_personnel?: boolean | null
          name: string
          students?: number | null
          type?: string | null
          visiting: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company?: string
          id?: string
          is_service_personnel?: boolean | null
          name?: string
          students?: number | null
          type?: string | null
          visiting?: string
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
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
