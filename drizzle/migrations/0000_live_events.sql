CREATE TABLE public.live_event_state (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  event_key text,
  stage int NOT NULL DEFAULT 0,
  stage_started_at timestamptz NOT NULL DEFAULT now(),
  run_id uuid NOT NULL DEFAULT gen_random_uuid(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.live_event_state TO anon, authenticated;
GRANT ALL ON public.live_event_state TO service_role;
ALTER TABLE public.live_event_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can see the current live event" ON public.live_event_state FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.live_event_state (id) VALUES (1);
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_event_state;