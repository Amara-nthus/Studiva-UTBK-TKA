-- Migration: Add question_bank table
CREATE TABLE public.question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  exam_type TEXT NOT NULL, -- 'snbt' or 'tka'
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings: ["Option A", "Option B", ...]
  answer_index INTEGER NOT NULL, -- Correct option index (0 to 4)
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions
GRANT SELECT ON public.question_bank TO authenticated;
GRANT ALL ON public.question_bank TO service_role;

-- Row Level Security (RLS)
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "allow_read_question_bank" ON public.question_bank
  FOR SELECT TO authenticated USING (true);
