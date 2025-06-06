// Remove React import as it's not needed in this schema file
import { z } from 'zod';

/**
 * Schemas Zod para validação de formulários
 * Centralizados para reuso em toda a aplicação
 */

// Regex patterns para validação
const phoneRegex = /^(\+55\s?)?(\(?[1-9][0-9]\)?\s?)?(9\s?)?[0-9]{4}\s?-?\s?[0-9]{4}$/;
const cpfRegex = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/;

// Mensagens de erro personalizadas em português
const errorMessages = {
  required: 'Este campo é obrigatório',
  email: 'Digite um email válido',
  phone: 'Digite um telefone válido (ex: (11) 99999-9999)',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
  cpf: 'Digite um CPF válido',
  url: 'Digite uma URL válida'
};

// Schema base para campos comuns
const baseFields = {
  nome: z
    .string({ required_error: errorMessages.required })
    .min(2, errorMessages.minLength(2))
    .max(100, errorMessages.maxLength(100))
    .trim(),
    
  email: z
    .string({ required_error: errorMessages.required })
    ['email'](errorMessages['email'])
    .toLowerCase()
    .trim(),
    
  telefone: z
    .string({ required_error: errorMessages.required })
    .regex(phoneRegex, errorMessages['phone'])
    .transform(val => val.replace(/\D/g, '')), // Remove caracteres não numéricos
    
  mensagem: z
    .string()
    .max(1000, errorMessages.maxLength(1000))
    .optional(),
    
  cpf: z
    .string()
    .regex(cpfRegex, errorMessages.cpf)
    .transform(val => val.replace(/\D/g, '')) // Remove caracteres não numéricos
    .optional(),
};

/**
 * Schema para formulário de contato geral
 */
export const ContactFormSchema = z.object({
  nome: baseFields['nome'],
  email: baseFields['email'],
  telefone: baseFields['telefone'],
  assunto: z
    .string({ required_error: errorMessages.required })
    .min(3, errorMessages.minLength(3))
    .max(200, errorMessages.maxLength(200)),
  mensagem: z
    .string({ required_error: errorMessages.required })
    .min(10, errorMessages.minLength(10))
    .max(1000, errorMessages.maxLength(1000)),
  
  // Campos opcionais para contexto
  propertyId: z.string().optional(),
  source: z.string().default('website'),
  
  // Honeypot para spam protection
  website: z.string().max(0).optional(),
  
  // Consentimento LGPD
  consent: z
    .boolean({ required_error: 'Você deve aceitar nossa política de privacidade' })
    .refine(val => val === true, 'Você deve aceitar nossa política de privacidade')
});

/**
 * Schema para newsletter
 */
export const NewsletterSchema = z.object({
  email: baseFields['email'],
  nome: baseFields['nome'].optional(),
  
  // Interesses (checkboxes)
  interests: z.array(z.enum([
    'apartamentos',
    'casas',
    'terrenos',
    'comercial',
    'rural',
    'lancamentos'
  ])).optional(),
  
  // Consentimento
  consent: z.boolean().refine(val => val === true, 'Consentimento obrigatório'),
  
  // Honeypot
  website: z.string().max(0).optional()
});

/**
 * Schema para consulta sobre imóvel específico
 */
export const PropertyInquirySchema = z.object({
  nome: baseFields['nome'],
  email: baseFields['email'],
  telefone: baseFields['telefone'],
  
  // Informações do imóvel
  propertyId: z.string({ required_error: 'ID do imóvel é obrigatório' }),
  propertyType: z.enum(['sale', 'rent'], { required_error: 'Tipo de negócio é obrigatório' }),
  
  // Informações específicas
  visitDate: z
    .string()
    .optional()
    .refine(
      val => !val || new Date(val) > new Date(),
      'Data da visita deve ser no futuro'
    ),
    
  budget: z
    .number()
    .positive('Orçamento deve ser positivo')
    .optional(),
    
  financingNeeded: z.boolean().optional(),
  
  message: z
    .string()
    .max(500, errorMessages.maxLength(500))
    .optional(),
    
  // Consentimento
  consent: z.boolean().refine(val => val === true, 'Consentimento obrigatório'),
  
  // Honeypot
  website: z.string().max(0).optional()
});

/**
 * Schema para agendamento de visita
 */
export const VisitScheduleSchema = z.object({
  nome: baseFields['nome'],
  email: baseFields['email'],
  telefone: baseFields['telefone'],
  
  propertyId: z.string({ required_error: 'ID do imóvel é obrigatório' }),
  
  preferredDate: z
    .string({ required_error: 'Data preferida é obrigatória' })
    .refine(
      val => new Date(val) > new Date(),
      'Data deve ser no futuro'
    ),
    
  preferredTime: z.enum([
    'morning',
    'afternoon',
    'evening'
  ], { required_error: 'Período preferido é obrigatório' }),
  
  alternativeDate: z
    .string()
    .optional()
    .refine(
      val => !val || new Date(val) > new Date(),
      'Data alternativa deve ser no futuro'
    ),
    
  notes: z
    .string()
    .max(300, errorMessages.maxLength(300))
    .optional(),
    
  // Consentimento
  consent: z.boolean().refine(val => val === true, 'Consentimento obrigatório'),
  
  // Honeypot
  website: z.string().max(0).optional()
});

/**
 * Schema para avaliação de imóvel
 */
export const PropertyEvaluationSchema = z.object({
  nome: baseFields['nome'],
  email: baseFields['email'],
  telefone: baseFields['telefone'],
  cpf: baseFields.cpf,
  
  // Informações do imóvel
  propertyType: z.enum([
    'apartamento',
    'casa',
    'terreno',
    'comercial',
    'rural'
  ], { required_error: 'Tipo do imóvel é obrigatório' }),
  
  address: z
    .string({ required_error: 'Endereço é obrigatório' })
    .min(10, errorMessages.minLength(10))
    .max(200, errorMessages.maxLength(200)),
    
  area: z
    .number({ required_error: 'Área é obrigatória' })
    .positive('Área deve ser positiva'),
    
  bedrooms: z.number().int().min(0).max(10).optional(),
  bathrooms: z.number().int().min(0).max(10).optional(),
  parkingSpots: z.number().int().min(0).max(10).optional(),
  
  propertyCondition: z.enum([
    'novo',
    'excelente',
    'bom',
    'regular',
    'precisa_reforma'
  ], { required_error: 'Estado do imóvel é obrigatório' }),
  
  purpose: z.enum([
    'venda',
    'aluguel',
    'curiosidade'
  ], { required_error: 'Finalidade é obrigatória' }),
  
  urgency: z.enum([
    'imediato',
    'ate_30_dias',
    'ate_90_dias',
    'sem_pressa'
  ]).optional(),
  
  additionalInfo: z
    .string()
    .max(500, errorMessages.maxLength(500))
    .optional(),
    
  // Consentimento
  consent: z.boolean().refine(val => val === true, 'Consentimento obrigatório'),
  
  // Honeypot
  website: z.string().max(0).optional()
});

/**
 * Schema para cadastro de interesse em lançamentos
 */
export const LaunchInterestSchema = z.object({
  nome: baseFields['nome'],
  email: baseFields['email'],
  telefone: baseFields['telefone'],
  
  // Preferências
  propertyTypes: z.array(z.enum([
    'apartamento',
    'casa',
    'terreno',
    'comercial'
  ])).min(1, 'Selecione pelo menos um tipo de imóvel'),
  
  budgetRange: z.enum([
    'ate_300k',
    '300k_500k',
    '500k_1M',
    '1M_2M',
    'acima_2M'
  ], { required_error: 'Faixa de orçamento é obrigatória' }),
  
  regions: z.array(z.string()).optional(),
  
  financingNeeded: z.boolean().optional(),
  
  timeline: z.enum([
    'imediato',
    'ate_6_meses',
    'ate_1_ano',
    'acima_1_ano'
  ]).optional(),
  
  // Consentimento
  consent: z.boolean().refine(val => val === true, 'Consentimento obrigatório'),
  marketingConsent: z.boolean().optional(),
  
  // Honeypot
  website: z.string().max(0).optional()
});

/**
 * Schema para formulário de lead
 */
export const LeadFormSchema = z.object({
  name: baseFields['nome'],
  email: baseFields['email'],
  phone: baseFields['telefone'],
  interest: z.enum(['comprar', 'alugar', 'investir', 'outro'], {
    required_error: errorMessages.required,
    invalid_type_error: 'Selecione um tipo de interesse válido'
  }),
  message: baseFields['mensagem']
});

// Tipos TypeScript derivados dos schemas
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type NewsletterData = z.infer<typeof NewsletterSchema>;
export type PropertyInquiryData = z.infer<typeof PropertyInquirySchema>;
export type VisitScheduleData = z.infer<typeof VisitScheduleSchema>;
export type PropertyEvaluationData = z.infer<typeof PropertyEvaluationSchema>;
export type LaunchInterestData = z.infer<typeof LaunchInterestSchema>;
export type LeadFormData = z.infer<typeof LeadFormSchema>;

// Utility function para validação com tratamento de erro
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
} {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors: Record<string, string[]> = {};
      
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue['message']);
      });
      
      return { success: false, errors };
    }
  } catch (error) {
    return { 
      success: false, 
      errors: { general: ['Erro de validação inesperado'] } 
    };
  }
}
