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
      ads_placements: {
        Row: {
          code: string | null
          created_at: string
          enabled: boolean
          id: string
          name: string
          provider: string
          slot: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          provider?: string
          slot: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          provider?: string
          slot?: string
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_links: {
        Row: {
          clicks: number
          commission_rate: number | null
          created_at: string
          enabled: boolean
          id: string
          merchant: string
          name: string
          notes: string | null
          product_type: string | null
          short_slug: string | null
          target_url: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          commission_rate?: number | null
          created_at?: string
          enabled?: boolean
          id?: string
          merchant: string
          name: string
          notes?: string | null
          product_type?: string | null
          short_slug?: string | null
          target_url: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          commission_rate?: number | null
          created_at?: string
          enabled?: boolean
          id?: string
          merchant?: string
          name?: string
          notes?: string | null
          product_type?: string | null
          short_slug?: string | null
          target_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: number
          metadata: Json
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: number
          metadata?: Json
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: number
          metadata?: Json
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      breeds: {
        Row: {
          breed_group: string | null
          coat_colors: string[]
          coat_type: string | null
          common_diseases: Json
          created_at: string
          energy_level: string | null
          exercise_description: string
          exercise_level: string
          exercise_minutes_per_day: number | null
          faqs: Json
          good_with: Json
          grooming: string
          grooming_frequency: string | null
          height_max: number | null
          height_min: number | null
          height_unit: string
          hero_image: string | null
          history: string
          id: string
          images: string[]
          lifespan_max: number | null
          lifespan_min: number | null
          name: string
          nutrition: string
          origin_country: string | null
          overview: string
          published: boolean
          related_article_slugs: string[]
          related_tool_slugs: string[]
          shedding_level: string | null
          size_category: string | null
          slug: string
          species: string
          temperament_description: string
          temperament_traits: string[]
          trainability: string | null
          updated_at: string
          weight_max: number | null
          weight_min: number | null
          weight_unit: string
        }
        Insert: {
          breed_group?: string | null
          coat_colors?: string[]
          coat_type?: string | null
          common_diseases?: Json
          created_at?: string
          energy_level?: string | null
          exercise_description?: string
          exercise_level?: string
          exercise_minutes_per_day?: number | null
          faqs?: Json
          good_with?: Json
          grooming?: string
          grooming_frequency?: string | null
          height_max?: number | null
          height_min?: number | null
          height_unit?: string
          hero_image?: string | null
          history?: string
          id?: string
          images?: string[]
          lifespan_max?: number | null
          lifespan_min?: number | null
          name: string
          nutrition?: string
          origin_country?: string | null
          overview?: string
          published?: boolean
          related_article_slugs?: string[]
          related_tool_slugs?: string[]
          shedding_level?: string | null
          size_category?: string | null
          slug: string
          species: string
          temperament_description?: string
          temperament_traits?: string[]
          trainability?: string | null
          updated_at?: string
          weight_max?: number | null
          weight_min?: number | null
          weight_unit?: string
        }
        Update: {
          breed_group?: string | null
          coat_colors?: string[]
          coat_type?: string | null
          common_diseases?: Json
          created_at?: string
          energy_level?: string | null
          exercise_description?: string
          exercise_level?: string
          exercise_minutes_per_day?: number | null
          faqs?: Json
          good_with?: Json
          grooming?: string
          grooming_frequency?: string | null
          height_max?: number | null
          height_min?: number | null
          height_unit?: string
          hero_image?: string | null
          history?: string
          id?: string
          images?: string[]
          lifespan_max?: number | null
          lifespan_min?: number | null
          name?: string
          nutrition?: string
          origin_country?: string | null
          overview?: string
          published?: boolean
          related_article_slugs?: string[]
          related_tool_slugs?: string[]
          shedding_level?: string | null
          size_category?: string | null
          slug?: string
          species?: string
          temperament_description?: string
          temperament_traits?: string[]
          trainability?: string | null
          updated_at?: string
          weight_max?: number | null
          weight_min?: number | null
          weight_unit?: string
        }
        Relationships: []
      }
      category_overrides: {
        Row: {
          description_override: string | null
          disabled: boolean
          featured: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title_override: string | null
          updated_at: string
        }
        Insert: {
          description_override?: string | null
          disabled?: boolean
          featured?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title_override?: string | null
          updated_at?: string
        }
        Update: {
          description_override?: string | null
          disabled?: boolean
          featured?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title_override?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string
          enabled: boolean
          id: string
          name: string
          slug: string
          subject: string
          updated_at: string
          variables: Json
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          slug: string
          subject: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          slug?: string
          subject?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          published: boolean
          question: string
          scope: string
          scope_ref: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          question: string
          scope?: string
          scope_ref?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          scope?: string
          scope_ref?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      foods: {
        Row: {
          alternatives: string[]
          benefits: string
          category: string
          created_at: string
          faqs: Json
          id: string
          image_url: string | null
          keywords: string[]
          name: string
          published: boolean
          related_food_slugs: string[]
          risks: string
          short_answer: string
          slug: string
          species_safety: Json
          symptoms: string
          updated_at: string
          vet_advice: string
        }
        Insert: {
          alternatives?: string[]
          benefits?: string
          category?: string
          created_at?: string
          faqs?: Json
          id?: string
          image_url?: string | null
          keywords?: string[]
          name: string
          published?: boolean
          related_food_slugs?: string[]
          risks?: string
          short_answer?: string
          slug: string
          species_safety?: Json
          symptoms?: string
          updated_at?: string
          vet_advice?: string
        }
        Update: {
          alternatives?: string[]
          benefits?: string
          category?: string
          created_at?: string
          faqs?: Json
          id?: string
          image_url?: string | null
          keywords?: string[]
          name?: string
          published?: boolean
          related_food_slugs?: string[]
          risks?: string
          short_answer?: string
          slug?: string
          species_safety?: Json
          symptoms?: string
          updated_at?: string
          vet_advice?: string
        }
        Relationships: []
      }
      generated_names: {
        Row: {
          created_at: string
          id: string
          meaning: string | null
          name: string
          name_key: string | null
          source: string
          species: string
          vibe: string
        }
        Insert: {
          created_at?: string
          id?: string
          meaning?: string | null
          name: string
          name_key?: string | null
          source?: string
          species: string
          vibe: string
        }
        Update: {
          created_at?: string
          id?: string
          meaning?: string | null
          name?: string
          name_key?: string | null
          source?: string
          species?: string
          vibe?: string
        }
        Relationships: []
      }
      internal_links: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          keyword: string
          priority: number
          target_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          keyword: string
          priority?: number
          target_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          keyword?: string
          priority?: number
          target_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          tags: string[] | null
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[] | null
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[] | null
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          source: string | null
          status: string
          subscribed_at: string
          tags: string[] | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string
          tags?: string[] | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string
          tags?: string[] | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      pet_allergies: {
        Row: {
          allergen: string
          allergen_type: string
          created_at: string
          emergency_notes: string | null
          id: string
          pet_id: string
          severity: string
          symptoms: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergen: string
          allergen_type?: string
          created_at?: string
          emergency_notes?: string | null
          id?: string
          pet_id: string
          severity?: string
          symptoms?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergen?: string
          allergen_type?: string
          created_at?: string
          emergency_notes?: string | null
          id?: string
          pet_id?: string
          severity?: string
          symptoms?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_allergies_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_deworming: {
        Row: {
          administered_on: string
          created_at: string
          document_path: string | null
          dose: string | null
          id: string
          medicine: string
          next_due_date: string | null
          notes: string | null
          pet_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          administered_on?: string
          created_at?: string
          document_path?: string | null
          dose?: string | null
          id?: string
          medicine: string
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          administered_on?: string
          created_at?: string
          document_path?: string | null
          dose?: string | null
          id?: string
          medicine?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_deworming_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_documents: {
        Row: {
          created_at: string
          doc_type: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          pet_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type?: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          pet_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          pet_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_documents_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          id: string
          notes: string | null
          pet_id: string
          receipt_path: string | null
          spent_on: string
          updated_at: string
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          pet_id: string
          receipt_path?: string | null
          spent_on?: string
          updated_at?: string
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          pet_id?: string
          receipt_path?: string | null
          spent_on?: string
          updated_at?: string
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_expenses_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_grooming: {
        Row: {
          cost: number | null
          created_at: string
          currency: string | null
          groomer: string | null
          id: string
          next_due_date: string | null
          notes: string | null
          performed_on: string
          pet_id: string
          service_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          currency?: string | null
          groomer?: string | null
          id?: string
          next_due_date?: string | null
          notes?: string | null
          performed_on?: string
          pet_id: string
          service_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          currency?: string | null
          groomer?: string | null
          id?: string
          next_due_date?: string | null
          notes?: string | null
          performed_on?: string
          pet_id?: string
          service_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_grooming_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_health_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          notes: string | null
          occurred_at: string
          pet_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          notes?: string | null
          occurred_at?: string
          pet_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          notes?: string | null
          occurred_at?: string
          pet_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_health_events_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_journal: {
        Row: {
          created_at: string
          entry: string
          entry_date: string
          id: string
          mood: string | null
          pet_id: string
          photo_path: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry: string
          entry_date?: string
          id?: string
          mood?: string | null
          pet_id: string
          photo_path?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry?: string
          entry_date?: string
          id?: string
          mood?: string | null
          pet_id?: string
          photo_path?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_journal_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_medications: {
        Row: {
          active: boolean
          afternoon: boolean
          created_at: string
          dosage: string | null
          end_date: string | null
          frequency: string | null
          id: string
          medicine_name: string
          morning: boolean
          night: boolean
          notes: string | null
          pet_id: string
          prescription_path: string | null
          purpose: string | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          afternoon?: boolean
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          medicine_name: string
          morning?: boolean
          night?: boolean
          notes?: string | null
          pet_id: string
          prescription_path?: string | null
          purpose?: string | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          afternoon?: boolean
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          medicine_name?: string
          morning?: boolean
          night?: boolean
          notes?: string | null
          pet_id?: string
          prescription_path?: string | null
          purpose?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_reminders: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          kind: string
          next_at: string | null
          notes: string | null
          pet_id: string
          recurrence: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          kind?: string
          next_at?: string | null
          notes?: string | null
          pet_id: string
          recurrence?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          kind?: string
          next_at?: string | null
          notes?: string | null
          pet_id?: string
          recurrence?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_reminders_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_travel: {
        Row: {
          created_at: string
          destination: string
          end_date: string | null
          id: string
          notes: string | null
          pet_id: string
          start_date: string
          transport: string | null
          updated_at: string
          user_id: string
          vaccination_checked: boolean
        }
        Insert: {
          created_at?: string
          destination: string
          end_date?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          start_date: string
          transport?: string | null
          updated_at?: string
          user_id: string
          vaccination_checked?: boolean
        }
        Update: {
          created_at?: string
          destination?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          start_date?: string
          transport?: string | null
          updated_at?: string
          user_id?: string
          vaccination_checked?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pet_travel_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_vaccinations: {
        Row: {
          certificate_path: string | null
          clinic: string | null
          completed: boolean
          created_at: string
          given_at: string | null
          id: string
          next_due_at: string | null
          notes: string | null
          pet_id: string
          updated_at: string
          user_id: string
          vaccine_name: string
          veterinarian: string | null
        }
        Insert: {
          certificate_path?: string | null
          clinic?: string | null
          completed?: boolean
          created_at?: string
          given_at?: string | null
          id?: string
          next_due_at?: string | null
          notes?: string | null
          pet_id: string
          updated_at?: string
          user_id: string
          vaccine_name: string
          veterinarian?: string | null
        }
        Update: {
          certificate_path?: string | null
          clinic?: string | null
          completed?: boolean
          created_at?: string
          given_at?: string | null
          id?: string
          next_due_at?: string | null
          notes?: string | null
          pet_id?: string
          updated_at?: string
          user_id?: string
          vaccine_name?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_vet_visits: {
        Row: {
          clinic: string | null
          created_at: string
          diagnosis: string | null
          doctor: string | null
          follow_up_at: string | null
          id: string
          invoice_path: string | null
          notes: string | null
          pet_id: string
          prescription_path: string | null
          reason: string | null
          treatment: string | null
          updated_at: string
          user_id: string
          visited_at: string
        }
        Insert: {
          clinic?: string | null
          created_at?: string
          diagnosis?: string | null
          doctor?: string | null
          follow_up_at?: string | null
          id?: string
          invoice_path?: string | null
          notes?: string | null
          pet_id: string
          prescription_path?: string | null
          reason?: string | null
          treatment?: string | null
          updated_at?: string
          user_id: string
          visited_at?: string
        }
        Update: {
          clinic?: string | null
          created_at?: string
          diagnosis?: string | null
          doctor?: string | null
          follow_up_at?: string | null
          id?: string
          invoice_path?: string | null
          notes?: string | null
          pet_id?: string
          prescription_path?: string | null
          reason?: string | null
          treatment?: string | null
          updated_at?: string
          user_id?: string
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_vet_visits_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_weight_logs: {
        Row: {
          created_at: string
          id: string
          logged_at: string
          notes: string | null
          pet_id: string
          user_id: string
          weight: number
          weight_unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          logged_at?: string
          notes?: string | null
          pet_id: string
          user_id: string
          weight: number
          weight_unit?: string
        }
        Update: {
          created_at?: string
          id?: string
          logged_at?: string
          notes?: string | null
          pet_id?: string
          user_id?: string
          weight?: number
          weight_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_weight_logs_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          adoption_date: string | null
          avatar_url: string | null
          birthdate: string | null
          breed: string | null
          breeder_shelter: string | null
          color: string | null
          created_at: string
          favorite_food: string | null
          favorite_toy: string | null
          gender: string | null
          height: number | null
          height_unit: string
          id: string
          is_mixed_breed: boolean
          medical_notes: string | null
          microchip_number: string | null
          name: string
          neutered: boolean
          notes: string | null
          secondary_breed: string | null
          species: string
          species_data: Json
          updated_at: string
          user_id: string
          weight: number | null
          weight_unit: string
        }
        Insert: {
          adoption_date?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          breed?: string | null
          breeder_shelter?: string | null
          color?: string | null
          created_at?: string
          favorite_food?: string | null
          favorite_toy?: string | null
          gender?: string | null
          height?: number | null
          height_unit?: string
          id?: string
          is_mixed_breed?: boolean
          medical_notes?: string | null
          microchip_number?: string | null
          name: string
          neutered?: boolean
          notes?: string | null
          secondary_breed?: string | null
          species?: string
          species_data?: Json
          updated_at?: string
          user_id: string
          weight?: number | null
          weight_unit?: string
        }
        Update: {
          adoption_date?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          breed?: string | null
          breeder_shelter?: string | null
          color?: string | null
          created_at?: string
          favorite_food?: string | null
          favorite_toy?: string | null
          gender?: string | null
          height?: number | null
          height_unit?: string
          id?: string
          is_mixed_breed?: boolean
          medical_notes?: string | null
          microchip_number?: string | null
          name?: string
          neutered?: boolean
          notes?: string | null
          secondary_breed?: string | null
          species?: string
          species_data?: Json
          updated_at?: string
          user_id?: string
          weight?: number | null
          weight_unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          category?: string
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      species_catalog: {
        Row: {
          color: string | null
          config: Json
          created_at: string
          description: string | null
          enabled: boolean
          icon: string | null
          id: string
          live: boolean
          plural: string
          singular: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon?: string | null
          id?: string
          live?: boolean
          plural: string
          singular: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon?: string | null
          id?: string
          live?: boolean
          plural?: string
          singular?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tool_overrides: {
        Row: {
          description_override: string | null
          disabled: boolean
          featured: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title_override: string | null
          updated_at: string
        }
        Insert: {
          description_override?: string | null
          disabled?: boolean
          featured?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title_override?: string | null
          updated_at?: string
        }
        Update: {
          description_override?: string | null
          disabled?: boolean
          featured?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title_override?: string | null
          updated_at?: string
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
