import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5432;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: data.user,
      token,
      session: data.session,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw error;

    res.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Captus Web API is running' });
});

// Protected routes for MVP
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', req.user.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const taskData = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase.from('tasks').insert(taskData);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('tasks').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;

    // Update streak if task completion status changed
    if (req.body.completed !== undefined) {
      await updateUserStreak(req.user.id);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('tasks').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subtasks routes
app.get('/api/subtasks', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('subtasks').select('*').eq('user_id', req.user.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subtasks', authenticateToken, async (req, res) => {
  try {
    const subtaskData = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase.from('subtasks').insert(subtaskData);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories routes
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Priorities routes
app.get('/api/priorities', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('priorities').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Streaks routes
app.get('/api/streaks', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('streaks').select('*').eq('user_id', req.user.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notifications routes
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('notifications').update({ read: true }).eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Streak calculation function
async function updateUserStreak(userId) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get user's streak record
    let { data: streak, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (streakError && streakError.code !== 'PGRST116') throw streakError;

    // Get completed tasks today
    const { data: completedTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('updated_at', today + ' 00:00:00')
      .lt('updated_at', today + ' 23:59:59');

    if (tasksError) throw tasksError;

    const hasCompletedToday = completedTasks.length > 0;

    if (!streak) {
      // Create new streak record
      const { data, error } = await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: hasCompletedToday ? 1 : 0,
          longest_streak: hasCompletedToday ? 1 : 0,
          last_completed_date: hasCompletedToday ? today : null,
        });
      if (error) throw error;
    } else {
      // Update existing streak
      let newCurrentStreak = streak.current_streak;
      let newLongestStreak = streak.longest_streak;

      if (hasCompletedToday && streak.last_completed_date !== today) {
        // Check if it's consecutive day
        const lastDate = new Date(streak.last_completed_date);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newCurrentStreak += 1;
        } else {
          newCurrentStreak = 1;
        }

        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak;
        }
      } else if (!hasCompletedToday) {
        // Reset streak if no completion today and it's a new day
        const lastDate = new Date(streak.last_completed_date);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          newCurrentStreak = 0;
        }
      }

      const { error } = await supabase
        .from('streaks')
        .update({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_completed_date: hasCompletedToday ? today : streak.last_completed_date,
        })
        .eq('user_id', userId);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});