import { supabase } from '../config/supabase';

const unwrap = (result) => {
  if (result.error) throw result.error;
  return result.data;
};

export const loadCategories = async () => unwrap(await supabase.from('categories').select('id,name').order('name'));

export const loadProducts = async () => {
  const rows = unwrap(await supabase
    .from('products')
    .select('*, category:categories(name), product_inputs(name,display_order), product_addons(id,name,price), product_highlights(highlight,display_order)')
    .order('created_at', { ascending: false }));

  return rows.map((row) => ({
    ...row,
    adultPrice: Number(row.adult_price),
    childPrice: Number(row.child_price),
    seniorPrice: Number(row.senior_price),
    imageUrl: row.image_url,
    category: row.category?.name ?? '',
    inputs: (row.product_inputs ?? []).sort((a, b) => a.display_order - b.display_order).map((input) => input.name),
    addOns: (row.product_addons ?? []).map((addon) => ({ id: addon.id, name: addon.name, addOnsPrice: Number(addon.price) })),
    highlights: (row.product_highlights ?? []).sort((a, b) => a.display_order - b.display_order).map((entry) => entry.highlight),
  }));
};

export const loadPackages = async () => {
  const rows = unwrap(await supabase.from('packages').select('*').order('created_at', { ascending: false }));
  return rows.map((row) => ({
    ...row,
    imageUrl: row.image_url,
    datesAvailable: row.dates_available ?? [],
    goodForStocks: row.good_for_stocks,
    placesToVisit: row.places_to_visit ?? [],
  }));
};

export const saveCategory = async (name) => {
  if (!name?.trim()) return null;
  return unwrap(await supabase.from('categories').upsert({ name: name.trim() }, { onConflict: 'name' }).select('id').single());
};

export const uploadCatalogImage = async (file) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${crypto.randomUUID()}-${safeName}`;
  unwrap(await supabase.storage.from('catalog-images').upload(path, file, { upsert: false }));
  return supabase.storage.from('catalog-images').getPublicUrl(path).data.publicUrl;
};

const replaceRows = async (table, productId, rows) => {
  unwrap(await supabase.from(table).delete().eq('product_id', productId));
  if (rows.length) unwrap(await supabase.from(table).insert(rows));
};

export const saveProduct = async ({ id, categoryName, ...values }) => {
  const category = categoryName ? await saveCategory(categoryName) : null;
  const productValues = {
    category_id: category?.id ?? null,
    name: values.name,
    description: values.description,
    adult_price: values.adultPrice,
    senior_price: values.seniorPrice,
    child_price: values.childPrice,
    image_url: values.imageUrl,
  };
  const result = id
    ? await supabase.from('products').update(productValues).eq('id', id).select('id').single()
    : await supabase.from('products').insert(productValues).select('id').single();
  const product = unwrap(result);

  await Promise.all([
    replaceRows('product_inputs', product.id, (values.inputs ?? []).filter(Boolean).map((name, index) => ({ product_id: product.id, name, display_order: index }))),
    replaceRows('product_addons', product.id, (values.addOns ?? []).filter((addon) => addon.name).map((addon) => ({ product_id: product.id, name: addon.name, price: Number(addon.addOnsPrice) || 0 }))),
    replaceRows('product_highlights', product.id, (values.highlights ?? []).filter(Boolean).map((highlight, index) => ({ product_id: product.id, highlight, display_order: index }))),
  ]);
};

export const deleteProduct = async (id) => unwrap(await supabase.from('products').delete().eq('id', id));

export const savePackage = async ({ id, ...values }) => {
  const toArray = (value) => Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
  const packageValues = {
  name: values.name,
  description: values.description,
  price: values.price,
  image_url: values.imageUrl,
  category: values.category,
  dates_available: toArray(values.datesAvailable),
  good_for_stocks: values.goodForStocks || null,
  places_to_visit: toArray(values.placesToVisit),
  inputs: toArray(values.inputs),
  note: values.note,
  };
  const result = id
    ? await supabase.from('packages').update(packageValues).eq('id', id).select('id').single()
    : await supabase.from('packages').insert(packageValues).select('id').single();
  return unwrap(result);
};

export const deletePackage = async (id) => unwrap(await supabase.from('packages').delete().eq('id', id));