import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env vars from frontend/.env.local
dotenv.config({ path: path.resolve(__dirname, '../frontend/.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const email = 'davidbarce0411@gmail.com'
const password = '123456789'

async function setupProfessor() {
    console.log(`Checking professor user: ${email}`)

    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.log('Login failed:', error.message)
        if (error.message.includes('Invalid login credentials')) {
            console.log('Attempting to sign up...')
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: 'Profesor David',
                        role: 'teacher'
                    }
                }
            })

            if (signUpError) {
                console.error('Sign up failed:', signUpError.message)
            } else {
                console.log('Sign up successful (or confirmation sent):', signUpData)
            }
        }
    } else {
        console.log('Login successful!')
        // Check if role is teacher
        if (data.user.user_metadata.role !== 'teacher') {
            console.warn('WARNING: User exists but role is not "teacher"!')
            const { error: updateError } = await supabase.auth.updateUser({
                data: { role: 'teacher' }
            })
            if (updateError) {
                console.error('Failed to update role:', updateError.message)
            } else {
                console.log('Role updated to teacher')
            }
        } else {
            console.log('User has correct role: teacher')
        }
    }
}

setupProfessor()
