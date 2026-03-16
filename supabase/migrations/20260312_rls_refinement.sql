-- Refine RLS Policies for NAFAA Brand v1.0

-- 1. Profiles: Users can read all (to see names in reviews etc), but only modify their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING ( true );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING ( auth.uid() = id );

-- 2. Products: Public read-only, Admins can do everything
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING ( true );

DROP POLICY IF EXISTS "Only admins can modify products" ON public.products;
CREATE POLICY "Only admins can modify products"
ON public.products FOR ALL
USING ( 
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Orders: Users see only their own, Admins see all
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING ( auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- 4. Order Items: Linked to Orders security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view items in their own orders" ON public.order_items;
CREATE POLICY "Users can view items in their own orders"
ON public.order_items FOR SELECT
USING ( 
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_id AND (user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ))
  )
);
