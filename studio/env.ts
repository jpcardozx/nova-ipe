import { EnvironmentManager } from '../lib/environment-config'

// Get validated Sanity configuration
const sanityConfig = EnvironmentManager.getSanityConfig();

// Validate configuration
if (!sanityConfig.configured) {
    console.error('Sanity Studio configuration is incomplete:');
    console.error(EnvironmentManager.getConfigErrorMessage('Sanity'));
}

export const projectId = sanityConfig.projectId
export const dataset = sanityConfig.dataset
export const apiVersion = sanityConfig.apiVersion || "2024-04-17"
