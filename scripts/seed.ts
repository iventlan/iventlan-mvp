import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const key =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(url, key)

async function run() {
  const categories = [
    { slug: 'salones', name_es: 'Salones infantiles', name_en: 'Kids venues' },
    { slug: 'decoracion', name_es: 'Decoración y globos', name_en: 'Decor & balloons' },
    { slug: 'dulces', name_es: 'Mesas de dulces', name_en: 'Candy bars' },
    { slug: 'pasteles', name_es: 'Pasteles', name_en: 'Cakes' },
    { slug: 'inflables', name_es: 'Inflables', name_en: 'Inflatables' },
    { slug: 'shows', name_es: 'Shows y animación', name_en: 'Shows & characters' },
    { slug: 'snacks', name_es: 'Carritos de snacks', name_en: 'Snack carts' },
    { slug: 'foto-video', name_es: 'Foto y video', name_en: 'Photo & video' },
  ]
  await supabase.from('categories').upsert(categories, { onConflict: 'slug' })

  const providers = [
    {
      slug: 'dania-perez-fotografia',
      brand_name: 'Dania Pérez Fotografía',
      category_slug: 'foto-video',
      city: 'Mazatlán',
      price_min: 1200, price_max: 3200,
      short_bio_es: 'Sesiones infantiles tiernas, Smash Cake y cobertura de fiesta. Entrega puntual y edición profesional.',
      short_bio_en: 'Sweet kids sessions, Smash Cake, and event coverage. On-time delivery and professional editing.',
      sla_es: 'Llegada 30’ antes; entrega de galería en 5–7 días.',
      sla_en: 'Arrive 30’ before; gallery delivered in 5–7 days.',
      response_time_min: 20,
      tags: ['smash cake','newborn','familia','exteriores'],
      verification_status: 'verified',
      images: ['https://picsum.photos/seed/dania1/800/600','https://picsum.photos/seed/dania2/800/600']
    },
    {
      slug: 'mi-pequeno-mundo',
      brand_name: 'Mi Pequeño Mundo Party Room',
      category_slug: 'salones',
      city: 'Mazatlán',
      price_min: 1800, price_max: 4500,
      short_bio_es: 'Salón infantil con paquetes todo incluido y horarios flexibles.',
      short_bio_en: 'Kids venue with all-inclusive packages and flexible times.',
      sla_es: 'Montaje 90’ antes; retiro +30’.',
      sla_en: 'Setup 90’ before; removal +30’.',
      response_time_min: 35,
      tags: ['alberca','estacionamiento','climatizado'],
      verification_status: 'verified',
      images: ['https://picsum.photos/seed/venue1/800/600','https://picsum.photos/seed/venue1b/800/600']
    },
    {
      slug: 'decoarte-globos',
      brand_name: 'DecoArte Globos',
      category_slug: 'decoracion',
      city: 'Mazatlán',
      price_min: 900, price_max: 3200,
      short_bio_es: 'Arcos y backdrops fotogénicos con montaje puntual.',
      short_bio_en: 'Photo-friendly arches and backdrops with on-time setup.',
      sla_es: 'Montaje 90’ antes; retiro +30’.',
      sla_en: 'Setup 90’ before; removal +30’.',
      response_time_min: 25,
      tags: ['arcos','backdrop','temático'],
      verification_status: 'verified',
      images: ['https://picsum.photos/seed/decor1/800/600']
    },
    {
      slug: 'rikittzimos',
      brand_name: 'Los Rikittzimos',
      category_slug: 'dulces',
      city: 'Mazatlán',
      price_min: 700, price_max: 2500,
      short_bio_es: 'Candy bar personalizado con opciones sin azúcar.',
      short_bio_en: 'Custom candy bars with sugar-free options.',
      sla_es: 'Montaje 60’ antes; retiro +30’.',
      sla_en: 'Setup 60’ before; removal +30’.',
      response_time_min: 40,
      tags: ['sin azúcar','temático'],
      verification_status: 'verified',
      images: ['https://picsum.photos/seed/candy1/800/600']
    },
    {
      slug: 'jumping-house',
      brand_name: 'Jumping House',
      category_slug: 'inflables',
      city: 'Mazatlán',
      price_min: null, price_max: null,
      short_bio_es: 'Brincolines y castillos limpios y seguros.',
      short_bio_en: 'Clean, safe bounce castles.',
      sla_es: 'Entrega 45’ antes; sanitización incluida.',
      sla_en: 'Delivery 45’ before; sanitized units.',
      response_time_min: 50,
      tags: ['limpieza','seguro'],
      verification_status: 'pending',
      images: ['https://picsum.photos/seed/inflatable1/800/600']
    },
    {
      slug: 'dj-fiesta-total',
      brand_name: 'DJ Fiesta Total',
      category_slug: 'shows',
      city: 'Mazatlán',
      price_min: 1800, price_max: 4800,
      short_bio_es: 'DJs para todos los gustos. Equipo profesional y playlists a medida.',
      short_bio_en: 'DJs for all tastes. Pro equipment and custom playlists.',
      sla_es: 'Prueba de sonido 60’ antes; backup USB.',
      sla_en: 'Soundcheck 60’ before; USB backup.',
      response_time_min: 30,
      tags: ['luces','mc','karaoke'],
      verification_status: 'verified',
      images: ['https://picsum.photos/seed/dj1/800/600','https://picsum.photos/seed/dj2/800/600']
    },
    {
      slug: 'salon-real',
      brand_name: 'Salón Real',
      category_slug: 'salones',
      city: 'Mazatlán',
      price_min: 8500, price_max: 12000,
      short_bio_es: 'Salón elegante con jardín y estacionamiento para 150 personas.',
      short_bio_en: 'Elegant venue with garden and parking for 150 guests.',
      sla_es: 'Acceso 2 h antes; limpieza posterior.',
      sla_en: 'Access 2 h before; cleanup included.',
      response_time_min: 28,
      tags: ['jardín','estacionamiento'],
      verification_status: 'verified',
      images: ['https://picsum.photos/seed/venue2/800/600']
    },
    {
      slug: 'carritos-del-mar',
      brand_name: 'Carritos del Mar',
      category_slug: 'snacks',
      city: 'Mazatlán',
      price_min: null, price_max: null,
      short_bio_es: 'Carritos de palomitas, algodones y mini hot-dogs.',
      short_bio_en: 'Popcorn, cotton candy and mini hot-dog carts.',
      sla_es: 'Montaje 40’ antes; consumo ilimitado por hora.',
      sla_en: 'Setup 40’ before; unlimited per hour.',
      response_time_min: 45,
      tags: ['palomitas','algodón'],
      verification_status: 'pending',
      images: ['https://picsum.photos/seed/snacks1/800/600']
    }
  ]

  await supabase.from('providers').upsert(providers, { onConflict: 'slug' })

  const { data: dania } = await supabase
    .from('providers').select('id')
    .eq('slug','dania-perez-fotografia').single()

  if (dania) {
    await supabase.from('promotions').upsert([{
      provider_id: dania.id,
      type: 'native_card',
      placement: 'category_top',
      target_category_slug: 'foto-video',
      status: 'active',
      title_es: 'Destacado en Foto y Video',
      title_en: 'Featured in Photo & Video',
      image_url: 'https://picsum.photos/seed/dania-ad/800/600'
    }])
  }

  console.log('Seed done.')
}

run().catch(e => { console.error(e); process.exit(1) })
