-- Create workers table
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pin TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 1,
  quantity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  is_return BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sale_items table (normalized products in each sale)
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_settings table for admin PIN
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_pin TEXT NOT NULL DEFAULT '1936',
  point_value INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin settings
INSERT INTO public.admin_settings (admin_pin, point_value) VALUES ('1936', 10);

-- Enable Row Level Security (permissive for internal app)
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (internal system without Supabase Auth)
CREATE POLICY "Allow all access to workers" ON public.workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to sale_items" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to admin_settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_sales_worker_id ON public.sales(worker_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX idx_workers_pin ON public.workers(pin);
CREATE INDEX idx_workers_active ON public.workers(active);