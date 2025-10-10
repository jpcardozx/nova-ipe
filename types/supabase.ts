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
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          created_at: string | null
          department: string
          email: string
          full_name: string
          id: string
          justification: string
          notes: string | null
          phone: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          full_name: string
          id?: string
          justification: string
          notes?: string | null
          phone: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          full_name?: string
          id?: string
          justification?: string
          notes?: string | null
          phone?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_name: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          properties: Json | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: string[] | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          event_type: string | null
          id: string
          location: string | null
          property_id: string | null
          start_date: string
          task_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          attendees?: string[] | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          event_type?: string | null
          id?: string
          location?: string | null
          property_id?: string | null
          start_date: string
          task_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          attendees?: string[] | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          event_type?: string | null
          id?: string
          location?: string | null
          property_id?: string | null
          start_date?: string
          task_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string | null
          contact_type: string
          contact_value: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          notes: string | null
        }
        Insert: {
          client_id?: string | null
          contact_type: string
          contact_value: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
        }
        Update: {
          client_id?: string | null
          contact_type?: string
          contact_value?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_history: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string
          duration_minutes: number | null
          id: string
          interaction_date: string | null
          interaction_type: string
          next_action: string | null
          outcome: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          duration_minutes?: number | null
          id?: string
          interaction_date?: string | null
          interaction_type: string
          next_action?: string | null
          outcome?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          duration_minutes?: number | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string
          next_action?: string | null
          outcome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cloud_folders: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_shared: boolean | null
          name: string
          parent_path: string | null
          path: string
          shared_with: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_shared?: boolean | null
          name: string
          parent_path?: string | null
          path: string
          shared_with?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_shared?: boolean | null
          name?: string
          parent_path?: string | null
          path?: string
          shared_with?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contract_signatures: {
        Row: {
          contract_id: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          signature_url: string | null
          signed_at: string | null
          signer_email: string
          signer_name: string
          signer_type: string
          user_agent: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          signature_url?: string | null
          signed_at?: string | null
          signer_email: string
          signer_name: string
          signer_type: string
          user_agent?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          signature_url?: string | null
          signed_at?: string | null
          signer_email?: string
          signer_name?: string
          signer_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          client_id: string
          commission_percentage: number | null
          commission_value: number | null
          contract_number: string
          contract_type: string
          contract_url: string | null
          created_at: string | null
          created_by: string | null
          down_payment: number | null
          end_date: string | null
          id: string
          monthly_payment: number | null
          notes: string | null
          property_id: string
          signature_date: string | null
          signed_contract_url: string | null
          start_date: string | null
          status: string | null
          total_value: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          commission_percentage?: number | null
          commission_value?: number | null
          contract_number: string
          contract_type: string
          contract_url?: string | null
          created_at?: string | null
          created_by?: string | null
          down_payment?: number | null
          end_date?: string | null
          id?: string
          monthly_payment?: number | null
          notes?: string | null
          property_id: string
          signature_date?: string | null
          signed_contract_url?: string | null
          start_date?: string | null
          status?: string | null
          total_value: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          commission_percentage?: number | null
          commission_value?: number | null
          contract_number?: string
          contract_type?: string
          contract_url?: string | null
          created_at?: string | null
          created_by?: string | null
          down_payment?: number | null
          end_date?: string | null
          id?: string
          monthly_payment?: number | null
          notes?: string | null
          property_id?: string
          signature_date?: string | null
          signed_contract_url?: string | null
          start_date?: string | null
          status?: string | null
          total_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          activity_type: string
          assigned_to: string | null
          client_id: string | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          id: string
          property_id: string | null
          scheduled_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          assigned_to?: string | null
          client_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          property_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          assigned_to?: string | null
          client_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          property_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          address: Json | null
          assigned_to: string | null
          budget_max: number | null
          budget_min: number | null
          client_code: string | null
          cpf_cnpj: string | null
          created_at: string | null
          created_by: string | null
          document: string | null
          email: string | null
          id: string
          lead_source: string | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          property_type: string | null
          source: string | null
          status: string | null
          transaction_type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_code?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          created_by?: string | null
          document?: string | null
          email?: string | null
          id?: string
          lead_source?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          property_type?: string | null
          source?: string | null
          status?: string | null
          transaction_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_code?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          created_by?: string | null
          document?: string | null
          email?: string | null
          id?: string
          lead_source?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          property_type?: string | null
          source?: string | null
          status?: string | null
          transaction_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_deals: {
        Row: {
          client_id: string | null
          closing_date: string | null
          commission_amount: number | null
          commission_rate: number | null
          created_at: string | null
          deal_type: string | null
          final_price: number | null
          id: string
          notes: string | null
          property_id: string | null
          proposed_price: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          closing_date?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          deal_type?: string | null
          final_price?: number | null
          id?: string
          notes?: string | null
          property_id?: string | null
          proposed_price?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          closing_date?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          deal_type?: string | null
          final_price?: number | null
          id?: string
          notes?: string | null
          property_id?: string | null
          proposed_price?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_type: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          property_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_type?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          property_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_type?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          property_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_notification_templates: {
        Row: {
          channel: string
          content_template: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subject_template: string | null
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          channel: string
          content_template: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject_template?: string | null
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          channel?: string
          content_template?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject_template?: string | null
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      crm_notifications: {
        Row: {
          channel: string
          created_at: string | null
          delivered_at: string | null
          delivery_status: Json | null
          email_data: Json | null
          error_message: string | null
          id: string
          is_read: boolean | null
          message: string | null
          push_data: Json | null
          read_at: string | null
          reminder_id: string | null
          sent_at: string | null
          sms_data: Json | null
          status: string | null
          title: string
          type: string
          user_id: string
          whatsapp_data: Json | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: Json | null
          email_data?: Json | null
          error_message?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          push_data?: Json | null
          read_at?: string | null
          reminder_id?: string | null
          sent_at?: string | null
          sms_data?: Json | null
          status?: string | null
          title: string
          type: string
          user_id: string
          whatsapp_data?: Json | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: Json | null
          email_data?: Json | null
          error_message?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          push_data?: Json | null
          read_at?: string | null
          reminder_id?: string | null
          sent_at?: string | null
          sms_data?: Json | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string
          whatsapp_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_notifications_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "crm_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_properties: {
        Row: {
          address: Json | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          images: Json | null
          owner_id: string | null
          price: number | null
          property_type: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          images?: Json | null
          owner_id?: string | null
          price?: number | null
          property_type?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          images?: Json | null
          owner_id?: string | null
          price?: number | null
          property_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_reminders: {
        Row: {
          activity_id: string | null
          assigned_to: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          notification_channels: Json | null
          notification_sent_at: string | null
          notification_status: string | null
          priority: string | null
          property_id: string | null
          recurrence_pattern: Json | null
          reminder_date: string
          reminder_type: string
          snooze_until: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          activity_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notification_channels?: Json | null
          notification_sent_at?: string | null
          notification_status?: string | null
          priority?: string | null
          property_id?: string | null
          recurrence_pattern?: Json | null
          reminder_date: string
          reminder_type: string
          snooze_until?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          activity_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notification_channels?: Json | null
          notification_sent_at?: string | null
          notification_status?: string | null
          priority?: string | null
          property_id?: string | null
          recurrence_pattern?: Json | null
          reminder_date?: string
          reminder_type?: string
          snooze_until?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_reminders_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "crm_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reminders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reminders_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reminders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          assigned_to: string | null
          category: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          estimated_duration: number | null
          id: string
          priority: string | null
          property_id: string | null
          reminders: Json | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          priority?: string | null
          property_id?: string | null
          reminders?: Json | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          priority?: string | null
          property_id?: string | null
          reminders?: Json | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      crm_user_settings: {
        Row: {
          created_at: string | null
          daily_digest: boolean | null
          email_notifications: boolean | null
          id: string
          notification_hours: Json | null
          push_notifications: boolean | null
          reminder_advance_time: number | null
          reminder_channel: string | null
          sms_notifications: boolean | null
          timezone: string | null
          updated_at: string | null
          urgent_channel: string | null
          user_id: string
          weekly_summary: boolean | null
          whatsapp_notifications: boolean | null
        }
        Insert: {
          created_at?: string | null
          daily_digest?: boolean | null
          email_notifications?: boolean | null
          id?: string
          notification_hours?: Json | null
          push_notifications?: boolean | null
          reminder_advance_time?: number | null
          reminder_channel?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          urgent_channel?: string | null
          user_id: string
          weekly_summary?: boolean | null
          whatsapp_notifications?: boolean | null
        }
        Update: {
          created_at?: string | null
          daily_digest?: boolean | null
          email_notifications?: boolean | null
          id?: string
          notification_hours?: Json | null
          push_notifications?: boolean | null
          reminder_advance_time?: number | null
          reminder_channel?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          urgent_channel?: string | null
          user_id?: string
          weekly_summary?: boolean | null
          whatsapp_notifications?: boolean | null
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          period_date: string
          period_type: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          period_date: string
          period_type: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          period_date?: string
          period_type?: string
        }
        Relationships: []
      }
      document_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          document_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_activities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_comments: {
        Row: {
          comment: string
          created_at: string | null
          document_id: string | null
          id: string
          is_internal: boolean | null
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          is_internal?: boolean | null
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          is_internal?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          access_level: string | null
          access_token: string | null
          created_at: string | null
          created_by: string
          document_id: string | null
          expires_at: string | null
          id: string
          shared_with_email: string | null
          shared_with_user_id: string | null
        }
        Insert: {
          access_level?: string | null
          access_token?: string | null
          created_at?: string | null
          created_by: string
          document_id?: string | null
          expires_at?: string | null
          id?: string
          shared_with_email?: string | null
          shared_with_user_id?: string | null
        }
        Update: {
          access_level?: string | null
          access_token?: string | null
          created_at?: string | null
          created_by?: string
          document_id?: string | null
          expires_at?: string | null
          id?: string
          shared_with_email?: string | null
          shared_with_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          created_at: string | null
          document_id: string | null
          id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          tag: string
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          document_id: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          document_id?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          document_id?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_tasks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          document_type_id: string | null
          id: string
          is_active: boolean | null
          name: string
          template_content: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          document_type_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          document_type_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_required: boolean | null
          name: string
          required_fields: Json | null
          retention_days: number | null
          updated_at: string | null
          workflow_stages: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          required_fields?: Json | null
          retention_days?: number | null
          updated_at?: string | null
          workflow_stages?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          required_fields?: Json | null
          retention_days?: number | null
          updated_at?: string | null
          workflow_stages?: Json | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          access_level: string | null
          approved_at: string | null
          approved_by: string | null
          client_id: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string
          current_stage: string | null
          deleted_at: string | null
          description: string | null
          document_type_id: string | null
          expiry_date: string | null
          file_hash: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_latest_version: boolean | null
          lead_id: string | null
          parent_document_id: string | null
          property_id: string | null
          reminder_date: string | null
          requires_signature: boolean | null
          signature_data: Json | null
          status: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version: number | null
          visibility: string | null
          workflow_data: Json | null
        }
        Insert: {
          access_level?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by: string
          current_stage?: string | null
          deleted_at?: string | null
          description?: string | null
          document_type_id?: string | null
          expiry_date?: string | null
          file_hash?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_latest_version?: boolean | null
          lead_id?: string | null
          parent_document_id?: string | null
          property_id?: string | null
          reminder_date?: string | null
          requires_signature?: boolean | null
          signature_data?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
          visibility?: string | null
          workflow_data?: Json | null
        }
        Update: {
          access_level?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string
          current_stage?: string | null
          deleted_at?: string | null
          description?: string | null
          document_type_id?: string | null
          expiry_date?: string | null
          file_hash?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_latest_version?: boolean | null
          lead_id?: string | null
          parent_document_id?: string | null
          property_id?: string | null
          reminder_date?: string | null
          requires_signature?: boolean | null
          signature_data?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
          visibility?: string | null
          workflow_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          due_date: string
          id: string
          invoice_number: string
          invoice_url: string | null
          issue_date: string
          notes: string | null
          paid_date: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_number: string
          invoice_url?: string | null
          issue_date: string
          notes?: string | null
          paid_date?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_url?: string | null
          issue_date?: string
          notes?: string | null
          paid_date?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          email: string | null
          id: string
          interest_type: string | null
          last_contact: string | null
          location_interest: string | null
          message: string | null
          name: string
          next_followup: string | null
          notes: string | null
          phone: string | null
          preferred_location: string | null
          priority: string | null
          property_interest: string | null
          property_type: string | null
          score: number | null
          source: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          interest_type?: string | null
          last_contact?: string | null
          location_interest?: string | null
          message?: string | null
          name: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          preferred_location?: string | null
          priority?: string | null
          property_interest?: string | null
          property_type?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          interest_type?: string | null
          last_contact?: string | null
          location_interest?: string | null
          message?: string | null
          name?: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          preferred_location?: string | null
          priority?: string | null
          property_interest?: string | null
          property_type?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          priority: string | null
          scheduled_for: string | null
          task_id: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          priority?: string | null
          scheduled_for?: string | null
          task_id?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          scheduled_for?: string | null
          task_id?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_type: string
          receipt_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_type: string
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_type?: string
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_approved?: boolean | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          built_area: number | null
          city: string
          condo_fee: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          featured: boolean | null
          garage_spaces: number | null
          id: string
          iptu: number | null
          land_area: number | null
          latitude: number | null
          longitude: number | null
          neighborhood: string | null
          owner_email: string | null
          owner_id: string | null
          owner_name: string | null
          owner_phone: string | null
          property_type: string
          rent_price: number | null
          sale_price: number | null
          state: string
          status: string | null
          title: string
          total_area: number | null
          transaction_type: string
          updated_at: string | null
          views_count: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          built_area?: number | null
          city: string
          condo_fee?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          land_area?: number | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          owner_email?: string | null
          owner_id?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          property_type: string
          rent_price?: number | null
          sale_price?: number | null
          state: string
          status?: string | null
          title: string
          total_area?: number | null
          transaction_type: string
          updated_at?: string | null
          views_count?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          built_area?: number | null
          city?: string
          condo_fee?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          land_area?: number | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          owner_email?: string | null
          owner_id?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          property_type?: string
          rent_price?: number | null
          sale_price?: number | null
          state?: string
          status?: string | null
          title?: string
          total_area?: number | null
          transaction_type?: string
          updated_at?: string | null
          views_count?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      property_features: {
        Row: {
          category: string | null
          created_at: string | null
          feature_name: string
          feature_value: string | null
          id: string
          property_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          feature_name: string
          feature_value?: string | null
          id?: string
          property_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          feature_name?: string
          feature_value?: string | null
          id?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_features_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          is_cover: boolean | null
          order_index: number | null
          property_id: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_cover?: boolean | null
          order_index?: number | null
          property_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_cover?: boolean | null
          order_index?: number | null
          property_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          chart_config: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          query_config: Json
          report_type: string
          updated_at: string | null
        }
        Insert: {
          chart_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          query_config: Json
          report_type: string
          updated_at?: string | null
        }
        Update: {
          chart_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          query_config?: Json
          report_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_folders: {
        Row: {
          created_at: string | null
          expires_at: string | null
          folder_id: string | null
          id: string
          permissions: Json
          shared_by: string | null
          shared_with: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          folder_id?: string | null
          id?: string
          permissions?: Json
          shared_by?: string | null
          shared_with?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          folder_id?: string | null
          id?: string
          permissions?: Json
          shared_by?: string | null
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_folders_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "cloud_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_folders_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_folders_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_duration: number | null
          assigned_to: string | null
          category: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          estimated_duration: number | null
          id: string
          priority: string | null
          property_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          assigned_to?: string | null
          category?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          priority?: string | null
          property_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          assigned_to?: string | null
          category?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          priority?: string | null
          property_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          action: string | null
          created_at: string | null
          granted_by: string | null
          id: string
          permission: string
          resource: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission: string
          resource?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: string
          resource?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified_at: string | null
          id: string
          last_login_at: string | null
          password_hash: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          id?: string
          last_login_at?: string | null
          password_hash?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          id?: string
          last_login_at?: string | null
          password_hash?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          assigned_agent: string | null
          client_id: string | null
          created_at: string | null
          feedback: string | null
          id: string
          interest_level: number | null
          notes: string | null
          property_id: string
          scheduled_date: string
          status: string | null
          updated_at: string | null
          visitor_email: string | null
          visitor_name: string
          visitor_phone: string
        }
        Insert: {
          assigned_agent?: string | null
          client_id?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interest_level?: number | null
          notes?: string | null
          property_id: string
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
          visitor_email?: string | null
          visitor_name: string
          visitor_phone: string
        }
        Update: {
          assigned_agent?: string | null
          client_id?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interest_level?: number | null
          notes?: string | null
          property_id?: string
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
          visitor_email?: string | null
          visitor_name?: string
          visitor_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_assigned_agent_fkey"
            columns: ["assigned_agent"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      wordpress_migration_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          progress: number | null
          property_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          progress?: number | null
          property_id?: string | null
          started_at?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          progress?: number | null
          property_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "wordpress_migration_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "wordpress_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      wordpress_properties: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          migrated_at: string | null
          notes: string | null
          photo_count: number | null
          photo_urls: string[] | null
          reviewed_at: string | null
          reviewed_by: string | null
          sanity_id: string | null
          search_vector: unknown | null
          status: string
          thumbnail_url: string | null
          updated_at: string | null
          wp_id: number
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          migrated_at?: string | null
          notes?: string | null
          photo_count?: number | null
          photo_urls?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sanity_id?: string | null
          search_vector?: unknown | null
          status: string
          thumbnail_url?: string | null
          updated_at?: string | null
          wp_id: number
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          migrated_at?: string | null
          notes?: string | null
          photo_count?: number | null
          photo_urls?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sanity_id?: string | null
          search_vector?: unknown | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          wp_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      wordpress_catalog_stats: {
        Row: {
          approved: number | null
          migrated: number | null
          pending: number | null
          ready_to_migrate: number | null
          rejected: number | null
          reviewing: number | null
          total: number | null
          with_photos: number | null
          without_photos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_access_request: {
        Args: { approval_notes?: string; request_id: string }
        Returns: boolean
      }
      check_folder_permission: {
        Args: {
          folder_uuid: string
          permission_type: string
          user_uuid: string
        }
        Returns: boolean
      }
      create_document_version: {
        Args: {
          new_file_hash: string
          new_file_path: string
          new_file_size: number
          original_doc_id: string
          updated_by_user: string
        }
        Returns: string
      }
      generate_sample_activities: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_folders_with_permissions: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          created_by: string
          description: string
          id: string
          is_owner: boolean
          is_shared: boolean
          name: string
          parent_path: string
          path: string
          permissions: Json
          updated_at: string
        }[]
      }
      log_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_entity_id?: string
          p_entity_type?: string
        }
        Returns: string
      }
      process_pending_reminders: {
        Args: Record<PropertyKey, never>
        Returns: {
          message: string
          reminder_id: string
          title: string
          user_id: string
        }[]
      }
      search_wordpress_properties: {
        Args: {
          filter_status?: string
          page_limit?: number
          page_offset?: number
          search_query: string
        }
        Returns: {
          created_at: string
          data: Json
          id: string
          photo_count: number
          rank: number
          status: string
          thumbnail_url: string
          wp_id: number
        }[]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
