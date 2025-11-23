import NotificationService from '../services/NotificationService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

class NotificationController {

  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Security check

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If no prefs exist, return defaults
      if (!data && (!error || error.code === 'PGRST116')) {
         return res.json({
             email_enabled: true,
             whatsapp_enabled: false,
             email: null,
             whatsapp: null
         });
      }

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const { email_enabled, whatsapp_enabled, email, whatsapp } = req.body;

      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          email_enabled,
          whatsapp_enabled,
          email,
          whatsapp,
          updated_at: new Date()
        })
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkDeadlines(req, res) {
    try {
        // This endpoint might need admin protection or verify a specific cron header key
        // For now assuming open for internal cron use
        await NotificationService.checkDeadlines();
        res.json({ success: true, message: 'Deadlines checked' });
    } catch (error) {
        console.error('Deadline check failed:', error);
        res.status(500).json({ error: error.message });
    }
  }
}

export default new NotificationController();
