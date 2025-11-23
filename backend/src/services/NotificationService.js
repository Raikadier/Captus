import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import EmailProvider from './notifications/providers/EmailProvider.js';
import WhatsAppProvider from './notifications/providers/WhatsAppProvider.js';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

class NotificationService {

  /**
   * Central method to send notifications.
   *
   * @param {Object} params
   * @param {string} params.user_id - The recipient's UUID.
   * @param {string} params.title - Notification title.
   * @param {string} params.body - Notification body.
   * @param {Object} [params.metadata] - Additional metadata (JSON).
   * @param {string} params.event_type - Type of event (e.g., 'task_created', 'assignment_due').
   * @param {string} params.entity_id - ID of the related entity (can be UUID or Int as string).
   * @param {boolean} [params.force=false] - Bypass duplicate checks if true.
   * @param {boolean} [params.is_auto=false] - If true, marks as an auto-generated notification (suppresses WhatsApp).
   */
  async notify({ user_id, title, body, metadata = {}, event_type, entity_id, force = false, is_auto = false }) {
    try {
      console.log(`[NotificationService] Processing notification for user ${user_id}: ${event_type}`);

      // 1. Check for duplicates in notification_logs if not forced
      if (!force) {
        const { data: logs, error: logError } = await supabase
          .from('notification_logs')
          .select('id')
          .eq('user_id', user_id)
          .eq('event_type', event_type)
          .eq('entity_id', String(entity_id))
          .single();

        if (logs) {
          console.log(`[NotificationService] Duplicate notification prevented: ${event_type} for ${user_id}`);
          return { success: false, reason: 'Duplicate' };
        }
      }

      // 2. Create In-App Notification
      // Note: We map 'event_type' to the 'type' column in public.notifications if needed, or assume schema update added event_type.
      // Based on the schema update plan, we added event_type, entity_id, metadata.
      // 'type' column in existing table is often used for 'info', 'warning', etc. or feature type.
      // We will use 'event_type' for the specific logic type.

      const notificationPayload = {
        user_id,
        title,
        body,
        type: event_type, // Using event_type as the main type categorization for now
        metadata,
        event_type,
        entity_id: String(entity_id),
        read: false
      };

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notificationPayload);

      if (insertError) {
        console.error('[NotificationService] Error inserting in-app notification:', insertError);
        // We continue to try external providers even if DB insert fails, or should we stop?
        // Usually we want best effort.
      }

      // 3. Log the notification to prevent future duplicates
      await supabase.from('notification_logs').insert({
        user_id,
        event_type,
        entity_id: String(entity_id)
      });

      // 4. Check User Preferences
      const { data: prefs, error: prefError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user_id)
        .single();

      // Defaults if no prefs found
      const emailEnabled = prefs ? prefs.email_enabled : true;
      const whatsappEnabled = prefs ? prefs.whatsapp_enabled : false;
      const userEmail = prefs?.email || null; // Fallback to auth email if needed (handled by provider caller typically, but here we need to fetch it)
      const userPhone = prefs?.whatsapp || null;

      // Retrieve user email from auth/users if custom email not set
      let finalEmail = userEmail;
      if (emailEnabled && !finalEmail) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
        if (userData && userData.user) {
            finalEmail = userData.user.email;
        }
      }

      // 5. Send Email
      if (emailEnabled && finalEmail) {
        await EmailProvider.sendEmail({
          to: finalEmail,
          subject: title,
          text: body,
          html: `<p>${body}</p>` // Simple HTML wrapper
        });
      }

      // 6. Send WhatsApp
      // Skip if is_auto is true (Auto-notifications logic)
      if (whatsappEnabled && userPhone && !is_auto) {
        await WhatsAppProvider.sendWhatsApp({
          to: userPhone,
          message: `${title}\n\n${body}`
        });
      }

      return { success: true };

    } catch (error) {
      console.error('[NotificationService] Unexpected error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper to check deadlines (Cron Logic)
  async checkDeadlines() {
    console.log('[NotificationService] Checking deadlines...');
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    // Fetch assignments due within 3 days
    // Assuming 'course_assignments' table has 'due_date' and 'id'
    const { data: assignments, error } = await supabase
      .from('course_assignments')
      .select(`
        id,
        title,
        due_date,
        course_id,
        courses (
          title,
          course_enrollments (
            user_id
          )
        )
      `)
      .lte('due_date', threeDaysFromNow.toISOString())
      .gte('due_date', now.toISOString()); // Only future deadlines closer than 3 days

    if (error) {
        console.error('[NotificationService] Error fetching assignments:', error);
        return;
    }

    if (!assignments || assignments.length === 0) return;

    for (const assignment of assignments) {
        const courseTitle = assignment.courses?.title || 'Course';
        const students = assignment.courses?.course_enrollments || [];

        for (const enrollment of students) {
            await this.notify({
                user_id: enrollment.user_id,
                title: 'Tarea Próxima a Vencer',
                body: `La tarea "${assignment.title}" del curso ${courseTitle} vence el ${new Date(assignment.due_date).toLocaleDateString()}.`,
                event_type: 'deadline_3d',
                entity_id: assignment.id,
                metadata: { due_date: assignment.due_date, course_id: assignment.course_id },
                is_auto: true // Automated system alert
            });
        }
    }
  }
}

export default new NotificationService();
