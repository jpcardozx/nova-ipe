-- CRM and Calendar System Schema
-- ================================

-- Create clients table for CRM
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE,
    phone VARCHAR,
    document VARCHAR, -- CPF/CNPJ
    address TEXT,
    city VARCHAR,
    state VARCHAR,
    zip_code VARCHAR,
    source VARCHAR, -- 'website', 'referral', 'social_media', 'cold_call', etc.
    status VARCHAR DEFAULT 'lead', -- 'lead', 'prospect', 'client', 'inactive'
    assigned_to UUID REFERENCES profiles(id),
    notes TEXT,
    budget_min DECIMAL,
    budget_max DECIMAL,
    property_preferences JSONB, -- Preferences like location, type, features
    last_contact DATE,
    next_follow_up DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Create client interactions table
CREATE TABLE IF NOT EXISTS client_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    interaction_type VARCHAR NOT NULL, -- 'call', 'email', 'meeting', 'whatsapp', 'visit'
    subject VARCHAR NOT NULL,
    description TEXT,
    outcome VARCHAR, -- 'interested', 'not_interested', 'scheduled_visit', 'needs_follow_up'
    interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties for CRM integration
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    property_type VARCHAR NOT NULL, -- 'house', 'apartment', 'commercial', 'land'
    transaction_type VARCHAR NOT NULL, -- 'sale', 'rent'
    price DECIMAL NOT NULL,
    area DECIMAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    garage_spaces INTEGER,
    address TEXT NOT NULL,
    city VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    zip_code VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    features JSONB, -- JSON array of features
    images JSONB, -- JSON array of image URLs
    status VARCHAR DEFAULT 'available', -- 'available', 'reserved', 'sold', 'rented'
    owner_contact JSONB, -- Owner contact information
    assigned_agent UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Create calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    event_type VARCHAR NOT NULL, -- 'meeting', 'property_visit', 'call', 'follow_up', 'personal'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR,
    client_id UUID REFERENCES clients(id),
    property_id UUID REFERENCES properties(id),
    status VARCHAR DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
    priority VARCHAR DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    reminder_minutes INTEGER DEFAULT 15,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB, -- For recurring events
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event participants table for shared calendar
CREATE TABLE IF NOT EXISTS event_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR DEFAULT 'invited', -- 'invited', 'accepted', 'declined', 'maybe'
    is_organizer BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    message TEXT,
    type VARCHAR NOT NULL, -- 'event_reminder', 'event_invite', 'client_update', 'system'
    reference_id UUID, -- Can reference event_id, client_id, etc.
    reference_type VARCHAR, -- 'event', 'client', 'property', etc.
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client property interests table
CREATE TABLE IF NOT EXISTS client_property_interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    interest_level VARCHAR DEFAULT 'interested', -- 'interested', 'very_interested', 'not_interested'
    notes TEXT,
    visit_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, property_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_assigned_to ON clients(assigned_to);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_next_follow_up ON clients(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_client_interactions_client_id ON client_interactions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_date ON client_interactions(interaction_date);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_assigned_agent ON properties(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by ON calendar_events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);

-- Enable RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_property_interests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Users can view clients assigned to them or created by them" ON clients
    FOR SELECT USING (
        assigned_to = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Users can insert clients" ON clients
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
    );

CREATE POLICY "Users can update clients assigned to them or created by them" ON clients
    FOR UPDATE USING (
        assigned_to = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- RLS Policies for client_interactions
CREATE POLICY "Users can view interactions for their clients" ON client_interactions
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM clients c 
            WHERE c.id = client_interactions.client_id 
            AND (c.assigned_to = auth.uid() OR c.created_by = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Users can insert interactions for their clients" ON client_interactions
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM clients c 
            WHERE c.id = client_interactions.client_id 
            AND (c.assigned_to = auth.uid() OR c.created_by = auth.uid())
        )
    );

-- RLS Policies for properties
CREATE POLICY "Users can view all properties" ON properties
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
    );

CREATE POLICY "Users can insert properties" ON properties
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
    );

CREATE POLICY "Users can update properties assigned to them or created by them" ON properties
    FOR UPDATE USING (
        assigned_agent = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- RLS Policies for calendar_events
CREATE POLICY "Users can view events they created or are participants in" ON calendar_events
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM event_participants ep 
            WHERE ep.event_id = calendar_events.id 
            AND ep.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert events" ON calendar_events
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
    );

CREATE POLICY "Users can update events they created" ON calendar_events
    FOR UPDATE USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM event_participants ep 
            WHERE ep.event_id = calendar_events.id 
            AND ep.user_id = auth.uid() 
            AND ep.can_edit = true
        )
    );

-- RLS Policies for event_participants
CREATE POLICY "Users can view participants of events they have access to" ON event_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM calendar_events ce 
            WHERE ce.id = event_participants.event_id 
            AND (ce.created_by = auth.uid() OR EXISTS (
                SELECT 1 FROM event_participants ep2 
                WHERE ep2.event_id = ce.id 
                AND ep2.user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Event creators can insert participants" ON event_participants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM calendar_events ce 
            WHERE ce.id = event_participants.event_id 
            AND ce.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update their own participation status" ON event_participants
    FOR UPDATE USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM calendar_events ce 
            WHERE ce.id = event_participants.event_id 
            AND ce.created_by = auth.uid()
        )
    );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for client_property_interests
CREATE POLICY "Users can view interests for their clients" ON client_property_interests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM clients c 
            WHERE c.id = client_property_interests.client_id 
            AND (c.assigned_to = auth.uid() OR c.created_by = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Users can insert interests for their clients" ON client_property_interests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM clients c 
            WHERE c.id = client_property_interests.client_id 
            AND (c.assigned_to = auth.uid() OR c.created_by = auth.uid())
        )
    );

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification for event reminders
CREATE OR REPLACE FUNCTION create_event_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notifications for all participants
    INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type, scheduled_for)
    SELECT 
        ep.user_id,
        'Lembrete: ' || NEW.title,
        'Evento agendado para ' || to_char(NEW.start_time, 'DD/MM/YYYY HH24:MI'),
        'event_reminder',
        NEW.id,
        'event',
        NEW.start_time - INTERVAL '1 minute' * COALESCE(NEW.reminder_minutes, 15)
    FROM event_participants ep
    WHERE ep.event_id = NEW.id AND ep.status = 'accepted';

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create notifications when event is created
CREATE TRIGGER create_event_notification_trigger
    AFTER INSERT ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION create_event_notification();

-- Function to send invitation notifications
CREATE OR REPLACE FUNCTION notify_event_participants()
RETURNS TRIGGER AS $$
BEGIN
    -- Send invitation notification
    INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type)
    SELECT 
        NEW.user_id,
        'Convite para evento: ' || ce.title,
        'Você foi convidado para participar do evento em ' || to_char(ce.start_time, 'DD/MM/YYYY HH24:MI'),
        'event_invite',
        NEW.event_id,
        'event'
    FROM calendar_events ce
    WHERE ce.id = NEW.event_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to send invitation when participant is added
CREATE TRIGGER notify_event_participants_trigger
    AFTER INSERT ON event_participants
    FOR EACH ROW EXECUTE FUNCTION notify_event_participants();