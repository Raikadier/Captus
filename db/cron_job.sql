-- Scheduled function for checking deadlines
-- This assumes pg_cron is enabled on the database
-- and that the Edge Function is deployed at the specified URL.
-- If using internal Node.js cron logic, this might trigger a webhook to your backend.

select
  cron.schedule(
    'daily_deadline_checker',
    '5 0 * * *', -- 00:05 AM UTC
    $$
    select
      net.http_get(
          url:='https://your-backend-url.com/api/notifications/check-deadlines', -- Pointing to the Node.js backend endpoint
          headers:='{"Content-Type": "application/json"}'
      ) as request_id;
    $$
  );
