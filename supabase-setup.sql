-- Run after creating the tables from the supplied YTA schema.
-- Also expose the exact schema name "YTA" in Supabase Dashboard > API > Exposed schemas.

ALTER TABLE "YTA".packages
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS dates_available DATE[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS good_for_stocks INTEGER,
  ADD COLUMN IF NOT EXISTS places_to_visit TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS inputs TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS note TEXT;

ALTER TABLE "YTA".cart_items
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE "YTA".order_items
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb;

GRANT USAGE ON SCHEMA "YTA" TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA "YTA" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "YTA" TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "YTA" TO authenticated;

CREATE OR REPLACE FUNCTION "YTA".is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$ SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false) $$;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['categories', 'products', 'product_inputs', 'product_addons', 'product_highlights', 'packages', 'package_items'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS catalog_read ON "YTA".%I', table_name);
    EXECUTE format('CREATE POLICY catalog_read ON "YTA".%I FOR SELECT TO anon, authenticated USING (true)', table_name);
    EXECUTE format('DROP POLICY IF EXISTS catalog_admin_write ON "YTA".%I', table_name);
    EXECUTE format('CREATE POLICY catalog_admin_write ON "YTA".%I FOR ALL TO authenticated USING ("YTA".is_admin()) WITH CHECK ("YTA".is_admin())', table_name);
  END LOOP;
END $$;

DROP POLICY IF EXISTS profiles_own_access ON "YTA".profiles;
CREATE POLICY profiles_own_access ON "YTA".profiles FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS carts_own_access ON "YTA".carts;
CREATE POLICY carts_own_access ON "YTA".carts FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS cart_items_own_access ON "YTA".cart_items;
CREATE POLICY cart_items_own_access ON "YTA".cart_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "YTA".carts c WHERE c.id = cart_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM "YTA".carts c WHERE c.id = cart_id AND c.user_id = auth.uid()));

DROP POLICY IF EXISTS orders_own_read ON "YTA".orders;
CREATE POLICY orders_own_read ON "YTA".orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR "YTA".is_admin());
DROP POLICY IF EXISTS orders_own_insert ON "YTA".orders;
CREATE POLICY orders_own_insert ON "YTA".orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS orders_admin_update ON "YTA".orders;
CREATE POLICY orders_admin_update ON "YTA".orders FOR UPDATE TO authenticated
  USING ("YTA".is_admin()) WITH CHECK ("YTA".is_admin());

DROP POLICY IF EXISTS order_items_owner_access ON "YTA".order_items;
CREATE POLICY order_items_owner_access ON "YTA".order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM "YTA".orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR "YTA".is_admin())));
DROP POLICY IF EXISTS order_items_owner_insert ON "YTA".order_items;
CREATE POLICY order_items_owner_insert ON "YTA".order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM "YTA".orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

DROP POLICY IF EXISTS order_item_addons_owner_access ON "YTA".order_item_addons;
CREATE POLICY order_item_addons_owner_access ON "YTA".order_item_addons FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM "YTA".order_items i JOIN "YTA".orders o ON o.id = i.order_id WHERE i.id = order_item_id AND (o.user_id = auth.uid() OR "YTA".is_admin())));
DROP POLICY IF EXISTS order_item_addons_owner_insert ON "YTA".order_item_addons;
CREATE POLICY order_item_addons_owner_insert ON "YTA".order_item_addons FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM "YTA".order_items i JOIN "YTA".orders o ON o.id = i.order_id WHERE i.id = order_item_id AND o.user_id = auth.uid()));

DROP POLICY IF EXISTS order_item_inputs_owner_access ON "YTA".order_item_inputs;
CREATE POLICY order_item_inputs_owner_access ON "YTA".order_item_inputs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM "YTA".order_items i JOIN "YTA".orders o ON o.id = i.order_id WHERE i.id = order_item_id AND (o.user_id = auth.uid() OR "YTA".is_admin())));
DROP POLICY IF EXISTS order_item_inputs_owner_insert ON "YTA".order_item_inputs;
CREATE POLICY order_item_inputs_owner_insert ON "YTA".order_item_inputs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM "YTA".order_items i JOIN "YTA".orders o ON o.id = i.order_id WHERE i.id = order_item_id AND o.user_id = auth.uid()));

INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', true), ('payment-images', 'payment-images', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS catalog_images_public_read ON storage.objects;
CREATE POLICY catalog_images_public_read ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'catalog-images');
DROP POLICY IF EXISTS catalog_images_admin_write ON storage.objects;
CREATE POLICY catalog_images_admin_write ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'catalog-images' AND "YTA".is_admin())
  WITH CHECK (bucket_id = 'catalog-images' AND "YTA".is_admin());
DROP POLICY IF EXISTS payment_images_owner_access ON storage.objects;
CREATE POLICY payment_images_owner_access ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'payment-images' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'payment-images' AND (storage.foldername(name))[1] = auth.uid()::text);