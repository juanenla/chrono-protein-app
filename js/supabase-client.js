/**
 * SUPABASE CLIENT
 * Initializes the Supabase connection for auth and database operations.
 *
 * IMPORTANT: The anon key is safe to expose in frontend code —
 * Row Level Security (RLS) on Supabase protects all data access.
 */

const SUPABASE_URL = 'https://mayiumggfhhenyvueyos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heWl1bWdnZmhoZW55dnVleW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODg5NjEsImV4cCI6MjA4ODM2NDk2MX0.oXBo1ODWXfzUjEtuF6oRVCA0k81Na4hf5QkvoxAtCOQ';

// Initialize client (requires supabase-js CDN loaded first)
// Use 'sb' to avoid conflict with the global 'supabase' namespace from CDN
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Auth helpers
 */
const Auth = {
  /** Sign up with email + password */
  async signUp(email, password) {
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  /** Sign in with email + password */
  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  /** Sign in with Google OAuth */
  async signInWithGoogle() {
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard.html' }
    });
    if (error) throw error;
    return data;
  },

  /** Sign out */
  async signOut() {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },

  /** Get current session (null if not logged in) */
  async getSession() {
    const { data: { session } } = await sb.auth.getSession();
    return session;
  },

  /** Get current user (null if not logged in) */
  async getUser() {
    const { data: { user } } = await sb.auth.getUser();
    return user;
  },

  /** Listen for auth state changes */
  onAuthStateChange(callback) {
    return sb.auth.onAuthStateChange(callback);
  }
};

/**
 * Profile helpers (read/write to profiles table)
 */
const Profiles = {
  /** Save or update a user profile */
  async upsert(profileData) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await sb
      .from('profiles')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Load the current user's profile */
  async load() {
    const user = await Auth.getUser();
    if (!user) return null;

    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  }
};

/**
 * Admin helpers
 */
const Admin = {
  /** Check if current user is an admin */
  async isAdmin() {
    const user = await Auth.getUser();
    if (!user) return false;

    const { data, error } = await sb
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error) return false;
    return !!data;
  },

  /** List all profiles (admin only — RLS enforced) */
  async listProfiles() {
    const { data, error } = await sb
      .from('profiles')
      .select('*, auth_email:id')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
