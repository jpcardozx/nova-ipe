export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category_id?: string;
    category?: TaskCategory;
    assigned_to?: string;
    created_by?: string;
    due_date?: string;
    due_time?: string;
    reminder_date?: string;
    completed_at?: string;
    client_id?: string;
    client_name?: string;
    client_phone?: string;
    property_id?: string;
    property_title?: string;
    reminder_enabled: boolean;
    reminder_minutes_before: number;
    recurring_type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurring_until?: string;
    tags?: string[];
    attachments?: any[];
    custom_fields?: Record<string, any>;
    notes?: string;
    created_at: string;
    updated_at: string;
    type: 'call' | 'meeting' | 'document' | 'follow_up' | 'visit' | 'other';
}

export interface Notification {
    id: string;
    type: 'task_reminder' | 'task_overdue' | 'task_assigned' | 'task_completed' | 'custom';
    title: string;
    message?: string;
    user_id: string;
    read: boolean;
    sent: boolean;
    task_id?: string;
    client_id?: string;
    scheduled_for?: string;
    sent_at?: string;
    delivery_methods: string[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface TaskCategory {
    id: string;
    name: string;
    color: string;
    icon: string;
    description?: string;
    created_by?: string;
    created_at: string;
}

export interface Lead {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    source: 'website' | 'referral' | 'social_media' | 'phone' | 'walk_in' | 'real_estate_portal';
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    property_interest?: string;
    budget_min?: number;
    budget_max?: number;
    location_interest?: string;
    message?: string;
    assigned_to?: string;
    created_by?: string;
    score?: number;
    last_contact?: string;
    next_followup?: string;
    notes?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
    created_at: string;
    updated_at?: string;
    conversion_probability?: number;
}