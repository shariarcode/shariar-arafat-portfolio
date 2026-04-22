
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function getEnv() {
    const envPath = path.join(process.cwd(), '.env');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > 0) {
            const key = trimmed.slice(0, index).trim();
            let val = trimmed.slice(index + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            env[key] = val;
        }
    }
    return env;
}

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
    console.log("Inspecting 'settings' table structure...");
    
    // We can't directly query information_schema with anon key usually
    // But we can try to fetch a row and see the keys
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching data:", error.message);
    } else if (data && data.length > 0) {
        console.log("Columns found in existing row:", Object.keys(data[0]));
    } else {
        console.log("No rows found to inspect columns.");
    }
}

debug();
