'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ContactFormSchema, PropertyInquirySchema, VisitScheduleSchema, LeadFormSchema } from '@/lib/schemas';
import type { FormData } from '@/src/types/forms';

const ENDPOINTS = {
  contact: process.env['CONTACT_API_ENDPOINT'] || '/api/contact',
  property: process.env['PROPERTY_API_ENDPOINT'] || '/api/property-inquiry',
  scheduling: process.env['SCHEDULING_API_ENDPOINT'] || '/api/schedule-visit',
  newsletter: process.env['NEWSLETTER_API_ENDPOINT'] || '/api/newsletter',
  lead: process.env['LEAD_API_ENDPOINT'] || '/api/lead',
} as const;

const contactFormSchema = ContactFormSchema;
const propertyInquirySchema = PropertyInquirySchema;
const visitScheduleSchema = VisitScheduleSchema;

/**
 * Handles contact form submissions
 */
export async function handleContactForm(formData: FormData) {
  try {
    // Validate form data with Zod
    const validatedData = contactFormSchema.parse(
      Object.fromEntries(formData.entries())
    );

    // Submit to CRM or API endpoint
    const response = await fetch(ENDPOINTS.contact, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit contact form: ${response.statusText}`);
    }

    // Revalidate relevant pages
    revalidatePath('/contato');
    
    return { 
      success: true, 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    };
  } catch (error) {
    console.error('Contact form submission error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors,
        message: 'Por favor, verifique os campos destacados.'
      };
    }
    
    return { 
      success: false, 
      message: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.' 
    };
  }
}

/**
 * Handles property inquiry form submissions
 */
export async function handlePropertyInquiry(formData: FormData) {
  try {
    const validatedData = propertyInquirySchema.parse(
      Object.fromEntries(formData.entries())
    );

    // Submit to property management system
    const response = await fetch(ENDPOINTS.property, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit property inquiry: ${response.statusText}`);
    }

    // Revalidate property listing
    const propertyId = formData.get('propertyId')?.toString();
    if (propertyId) {
      revalidateTag(`property-${propertyId}`);
    }
    
    return { 
      success: true, 
      message: 'Sua solicitação sobre este imóvel foi enviada. Nossa equipe entrará em contato em breve!' 
    };
  } catch (error) {
    console.error('Property inquiry error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors,
        message: 'Por favor, verifique os campos destacados.'
      };
    }
    
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.' 
    };
  }
}

/**
 * Handles property visit scheduling
 */
export async function scheduleVisit(formData: FormData) {
  try {
    const validatedData = visitScheduleSchema.parse(
      Object.fromEntries(formData.entries())
    );

    // Submit to scheduling system
    const response = await fetch(ENDPOINTS.scheduling, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`Failed to schedule visit: ${response.statusText}`);
    }

    return { 
      success: true, 
      message: 'Visita agendada com sucesso! Confirmamos os detalhes por e-mail e telefone.' 
    };
  } catch (error) {
    console.error('Visit scheduling error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors,
        message: 'Por favor, verifique os campos destacados.'
      };
    }
    
    return { 
      success: false, 
      message: 'Não foi possível agendar sua visita. Por favor, tente novamente ou entre em contato por telefone.' 
    };
  }
}

/**
 * Handles newsletter subscription
 */
export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Simple validation for email
    const email = formData.get('email')?.toString();
    if (!email || !email.includes('@')) {
      return { 
        success: false,
        message: 'Por favor, forneça um e-mail válido.'
      };
    }

    // Submit to newsletter service
    const response = await fetch(ENDPOINTS.newsletter, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe: ${response.statusText}`);
    }

    return { 
      success: true, 
      message: 'Inscrição realizada com sucesso! Você receberá nossas novidades.' 
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.' 
    };
  }
}

/**
 * Handles lead generation forms
 */
export async function handleLeadGeneration(formData: FormData) {
  try {
    const validatedData = LeadFormSchema.parse(
      Object.fromEntries(formData.entries())
    );

    // Submit to CRM
    const response = await fetch(ENDPOINTS.lead, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit lead: ${response.statusText}`);
    }

    return { 
      success: true, 
      message: 'Obrigado pelo seu interesse! Entraremos em contato em breve.' 
    };
  } catch (error) {
    console.error('Lead generation error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors,
        message: 'Por favor, verifique os campos destacados.'
      };
    }
    
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.' 
    };
  }
}

// Resolver erro de 'error' ser do tipo 'unknown'
try {
} catch (error) {
  if (error instanceof Error) {
    console.error(error['message']);
  }
}
