-- Create transactions table for payment verification
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  transaction_id text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  credits_requested integer NOT NULL DEFAULT 1,
  credit_type text NOT NULL DEFAULT 'basic',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  confirmed_at timestamp with time zone,
  confirmed_by uuid
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions"
ON public.transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update transactions
CREATE POLICY "Admins can update all transactions"
ON public.transactions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));