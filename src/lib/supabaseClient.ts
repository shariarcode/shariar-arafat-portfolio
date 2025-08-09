import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your project's URL and Anon Key from your Supabase project settings.
const supabaseUrl = 'https://peyezboklumlqxuhucjd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBleWV6Ym9rbHVtbHF4dWh1Y2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjcyMDUsImV4cCI6MjA3MDMwMzIwNX0.rV4L6SV0KdBlpCBCASm3YRAbsRGOPZFdb2XH_q85-Lg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)