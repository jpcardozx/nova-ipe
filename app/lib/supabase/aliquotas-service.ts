// Supabase integration service for Aliquotas functionality
// This service handles CRM client data and transaction logging

interface CRMClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  neighborhood?: string;
  source?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  notes?: string;
  budget_min?: number;
  budget_max?: number;
  property_type?: string;
  transaction_type?: string;
  urgency?: string;
  property_preferences?: any;
  last_contact?: string;
  next_follow_up?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface ClientTransaction {
  id?: string;
  client_id: string;
  transaction_type: string;
  transaction_data: any;
  amount?: number;
  description?: string;
  status?: 'pending' | 'completed' | 'failed';
  created_at?: string;
  created_by?: string;
}

interface Property {
  id: string;
  address: string;
  tenant: string;
  currentRent: number;
  iptu: number;
  referenceRate: number;
  newRent: number;
  status: 'pending' | 'approved' | 'sent';
  lastUpdate: string;
}

export class AliquotasSupabaseService {
  // In production, initialize with actual Supabase client
  // private supabase: SupabaseClient;

  /**
   * Get all CRM clients for selection
   */
  static async getCRMClients(): Promise<CRMClient[]> {
    try {
      // Mock implementation - replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('crm_clients')
      //   .select('*')
      //   .order('name');

      // if (error) throw error;

      // Mock data matching the crm_clients table structure
      const mockClients: CRMClient[] = [
        {
          id: '1',
          name: 'Maria Silva',
          email: 'maria.silva@email.com',
          phone: '(11) 99999-1234',
          document: '123.456.789-00',
          address: 'Rua das Flores, 123',
          city: 'Guararema',
          state: 'SP',
          zip_code: '08900-000',
          source: 'website',
          status: 'client',
          priority: 'high',
          property_type: 'apartment',
          transaction_type: 'rent',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'João Santos',
          email: 'joao.santos@email.com',
          phone: '(11) 98888-5678',
          document: '987.654.321-00',
          address: 'Av. Paulista, 456',
          city: 'Guararema',
          state: 'SP',
          zip_code: '08900-001',
          source: 'referral',
          status: 'client',
          priority: 'medium',
          property_type: 'house',
          transaction_type: 'buy',
          created_at: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          name: 'Ana Costa',
          email: 'ana.costa@email.com',
          phone: '(11) 97777-9012',
          document: '456.789.123-00',
          address: 'Rua Augusta, 789',
          city: 'Guararema',
          state: 'SP',
          zip_code: '08900-002',
          source: 'walk_in',
          status: 'client',
          priority: 'medium',
          property_type: 'apartment',
          transaction_type: 'rent',
          created_at: '2024-01-03T00:00:00Z'
        }
      ];

      return mockClients;

    } catch (error) {
      console.error('Error fetching CRM clients:', error);
      throw new Error('Failed to fetch clients');
    }
  }

  /**
   * Get client by ID
   */
  static async getClientById(clientId: string): Promise<CRMClient | null> {
    try {
      // Mock implementation
      // const { data, error } = await supabase
      //   .from('crm_clients')
      //   .select('*')
      //   .eq('id', clientId)
      //   .single();

      // if (error) throw error;

      const clients = await this.getCRMClients();
      return clients.find(client => client.id === clientId) || null;

    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  }

  /**
   * Log transaction in client's record
   */
  static async logClientTransaction(
    clientId: string,
    transactionType: string,
    transactionData: any,
    description?: string,
    amount?: number
  ): Promise<boolean> {
    try {
      const transaction: ClientTransaction = {
        client_id: clientId,
        transaction_type: transactionType,
        transaction_data: transactionData,
        description,
        amount,
        status: 'completed',
        created_at: new Date().toISOString(),
        created_by: 'system' // In production, use actual user ID
      };

      // Mock implementation
      console.log('Logging client transaction:', transaction);

      // In production, use actual Supabase insert:
      // const { error } = await supabase
      //   .from('client_transactions')
      //   .insert(transaction);

      // if (error) throw error;

      // Also update the client's last_contact and notes
      await this.updateClientLastContact(clientId, `Reajuste de aluguel enviado - ${transactionType}`);

      return true;

    } catch (error) {
      console.error('Error logging client transaction:', error);
      return false;
    }
  }

  /**
   * Update client's last contact and add notes
   */
  static async updateClientLastContact(
    clientId: string,
    note: string
  ): Promise<boolean> {
    try {
      // Mock implementation
      console.log('Updating client last contact:', { clientId, note });

      // In production:
      // const { error } = await supabase
      //   .from('crm_clients')
      //   .update({
      //     last_contact: new Date().toISOString(),
      //     notes: note,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', clientId);

      // if (error) throw error;

      return true;

    } catch (error) {
      console.error('Error updating client contact:', error);
      return false;
    }
  }

  /**
   * Get client transactions history
   */
  static async getClientTransactions(clientId: string): Promise<ClientTransaction[]> {
    try {
      // Mock implementation
      // const { data, error } = await supabase
      //   .from('client_transactions')
      //   .select('*')
      //   .eq('client_id', clientId)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;

      // Mock transaction history
      const mockTransactions: ClientTransaction[] = [
        {
          id: '1',
          client_id: clientId,
          transaction_type: 'aliquotas_pdf_sent',
          transaction_data: {
            filename: 'aliquotas_janeiro_2024.pdf',
            properties_count: 2,
            total_increase: 150.00
          },
          description: 'PDF de reajuste de aluguel enviado',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          created_by: 'system'
        }
      ];

      return mockTransactions;

    } catch (error) {
      console.error('Error fetching client transactions:', error);
      return [];
    }
  }

  /**
   * Create or update property in the system
   */
  static async saveProperty(property: Property): Promise<boolean> {
    try {
      // Mock implementation
      console.log('Saving property:', property);

      // In production, save to properties table:
      // const { error } = await supabase
      //   .from('properties')
      //   .upsert({
      //     id: property.id,
      //     address: property.address,
      //     tenant: property.tenant,
      //     current_rent: property.currentRent,
      //     iptu: property.iptu,
      //     reference_rate: property.referenceRate,
      //     new_rent: property.newRent,
      //     status: property.status,
      //     last_update: property.lastUpdate,
      //     updated_at: new Date().toISOString()
      //   });

      // if (error) throw error;

      return true;

    } catch (error) {
      console.error('Error saving property:', error);
      return false;
    }
  }

  /**
   * Get properties for a specific client/tenant
   */
  static async getClientProperties(clientId: string): Promise<Property[]> {
    try {
      // Mock implementation
      // const { data, error } = await supabase
      //   .from('properties')
      //   .select('*')
      //   .eq('tenant_id', clientId);

      // if (error) throw error;

      // Mock properties data
      const mockProperties: Property[] = [
        {
          id: '1',
          address: 'Rua das Flores, 123 - Jardim Paulista',
          tenant: 'Maria Silva',
          currentRent: 2500,
          iptu: 150,
          referenceRate: 0.035,
          newRent: 2587.50,
          status: 'approved',
          lastUpdate: '2024-01-15'
        }
      ];

      return mockProperties;

    } catch (error) {
      console.error('Error fetching client properties:', error);
      return [];
    }
  }
}

// Export convenience functions
export const getCRMClients = AliquotasSupabaseService.getCRMClients;
export const getClientById = AliquotasSupabaseService.getClientById;
export const logClientTransaction = AliquotasSupabaseService.logClientTransaction;
export const updateClientLastContact = AliquotasSupabaseService.updateClientLastContact;