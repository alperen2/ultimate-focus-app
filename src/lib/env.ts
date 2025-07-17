/**
 * Environment variables validation and type safety
 */

const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

const optionalEnvVars = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;

// Validate required environment variables
function validateEnv() {
  const missingVars: string[] = [];
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please create a .env.local file with these variables.'
    );
  }
}

// Validate on module load
if (typeof window === 'undefined') {
  validateEnv();
}

export const env = {
  ...requiredEnvVars,
  ...optionalEnvVars,
} as {
  readonly NEXT_PUBLIC_SUPABASE_URL: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string | undefined;
};