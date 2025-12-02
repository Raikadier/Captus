import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// Try to load envs from different locations
const envPaths = [
    path.resolve('./backend/.env'),
    path.resolve('./frontend/.env'),
    path.resolve('./frontend/.env.local')
];

envPaths.forEach(p => {
    if (fs.existsSync(p)) {
        console.log(`Loading env from ${p}`);
        dotenv.config({ path: p });
    }
});

const API_URL = 'http://localhost:4000/api'; // Backend URL

async function testLogin(email, password, expectedRole) {
    console.log(`Testing login for ${email} (Expected Role: ${expectedRole})...`);
    try {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase credentials. Checked SUPABASE_URL/VITE_SUPABASE_URL and SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY');
            return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error(`❌ Login failed for ${email}:`, error.message);
            return;
        }

        console.log(`✅ Login successful for ${email}`);
        const token = data.session.access_token;
        const user = data.user;

        console.log(`   User ID: ${user.id}`);
        console.log(`   Role in Metadata: ${user.user_metadata.role}`);

        if (user.user_metadata.role !== expectedRole) {
            console.warn(`⚠️  WARNING: Expected role '${expectedRole}' but got '${user.user_metadata.role}'`);
        } else {
            console.log(`✅ Role matches expected: ${expectedRole}`);
        }

        // 2. Test a protected route on the backend
        try {
            // Try to access a protected route. /api/tasks is a good candidate.
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(`✅ Backend access confirmed (Status: ${response.status})`);
        } catch (apiError) {
            console.error(`❌ Backend access failed: ${apiError.message}`);
            if (apiError.response) {
                console.error(`   Status: ${apiError.response.status}`);
                console.error(`   Data:`, apiError.response.data);
            }
        }

    } catch (err) {
        console.error(`❌ Unexpected error:`, err);
    }
    console.log('------------------------------------------------');
}

async function runTests() {
    console.log('Starting Script-Based E2E Tests...');
    console.log('------------------------------------------------');

    // Test Student
    await testLogin('davidbarcelo0411@gmail.com', '123456789', 'student');

    // Test Professor
    await testLogin('davidbarce0411@gmail.com', '123456789', 'teacher');

    console.log('Tests Completed.');
}

runTests();
