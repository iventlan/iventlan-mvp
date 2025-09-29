// /app/[locale]/proveedores/registro/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CATEGORIES = [
  { slug: "salones", label: "Salones infantiles" },
  { slug: "decoracion", label: "Decoración y globos" },
  { slug: "dulces", label: "Mesas de dulces" },
  { slug: "pasteles", label: "Pasteles" },
  { slug: "inflables", label: "Inflables" },
  { slug: "shows", label: "Shows y animación" },
  { slug: "snacks", label: "Carritos de snacks" },
  { slug: "foto-video", label: "Foto y video" },
  { slug: "otras", label: "Otra (especifica)" },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProviderRegisterPage() {
  const params = useParams() as { locale: "es" | "en" };
  const locale = params?.locale || "es";

  // Campos base
  const [brand, setBrand] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [otherCategory, setOtherCategory] = React.useState("");
  const cityDefault = "Mazatlán"; // oculto por ahora

  const [priceMin, setPriceMin] = React.useState<string>("");
  const [priceMax, setPriceMax] = React.useState<string>("");
  const [bio, setBio] = React.useState("");

  const [policy, setPolicy] = React.useState(""); // reemplaza SLA
  const [tags, setTags] = React.useState("");

  const [legalName, setLegalName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState<"propietario" | "representante">(
    "propietario"
  );

  // Evidencias
  const [ineFront, setIneFront] = React.useState<File | null>(null);
  const [ineBack, setIneBack] = React.useState<File | null>(null);
  const [proofAddress, setProofAddress] = React.useState<File | null>(null);
  const [taxCert, setTaxCert] = React.useState<File | null>(null); // OPCIONAL
  const [selfie, setSelfie] = React.useState<File | null>(null);
  const [bizImages, setBizImages] = React.useState<FileList | null>(null);

  // Slug automático
  React.useEffect(() => {
    setSlug(slugify(brand));
  }, [brand]);

  // Validación básica
  const imagesCount = bizImages?.length ?? 0;
  const imagesCountValid = imagesCount >= 3 && imagesCount <= 6;

  const isValid =
    brand.trim().length > 1 &&
    (category && (category !== "otras" || otherCategory.trim().length > 1)) &&
    email.trim().length > 3 &&
    phone.trim().length >= 8 &&
    ineFront &&
    ineBack &&
    proofAddress &&
    // taxCert es opcional
    selfie &&
    imagesCountValid;

  // Resolver categoría cuando eligen "otras"
  function resolveCategory(): { slug: string; label: string } {
    if (category !== "otras") {
      const found = CATEGORIES.find((c) => c.slug === category)!;
      return found;
    }
    const typed = otherCategory.trim().toLowerCase();
    const match = CATEGORIES.find((c) =>
      c.label.toLowerCase().includes(typed)
    );
    if (match) return match;
    return { slug: "otras", label: otherCategory.trim() || "Otra" };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const resolved = resolveCategory();
    const fd = new FormData(e.currentTarget);

    // Mapeo/compatibilidad
    fd.set("slug", slug);
    fd.set("brand_name", brand);
    fd.set("category_slug", resolved.slug);
    fd.set("category_label", resolved.label);
    // Ciudad oculta por ahora para no romper el esquema
    fd.set("city", cityDefault);

    fd.set("bio_es", bio);
    fd.set("bio_en", bio);

    fd.set("sla_es", policy);
    fd.set("sla_en", policy);

    fd.set("tags", tags);

    fd.set("email", email);
    fd.set("phone", phone);
    fd.set("corporate_email", email);

    // Control de visibilidad y flujo de revisión
    fd.set("verification_status", "pending_review");
    fd.set("is_visible", "false");
    fd.set("review_required", "true");

    // Rango de precio (opcional)
    fd.set("price_min", priceMin);
    fd.set("price_max", priceMax);

    if (resolved.slug === "otras") {
      fd.set("other_category_detail", otherCategory.trim());
    }

    if (!imagesCountValid) {
      alert("Sube de 3 a 6 imágenes del negocio.");
      return;
    }

    try {
      const res = await fetch(`/${locale}/api/provider-register`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("No se pudo registrar.");
      alert(
        "¡Registro enviado! Tu perfil quedará en revisión y NO será visible hasta que verifiquemos tu información."
      );
      (e.target as HTMLFormElement).reset();
      setBizImages(null);
    } catch (err: any) {
      alert(err?.message || "Error al enviar el registro.");
    }
  }

  return (
    <main className="container max-w-3xl py-8">
      <h1 className="text-3xl font-semibold">Regístrate como proveedor</h1>
      <p className="mt-1 text-brand-slate">
        Completa el formulario. El rango de precio es opcional.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* Nombre comercial */}
        <input
          required
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          name="brand_name"
          placeholder="Nombre comercial"
          className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
        />
        {/* Slug oculto (compatibilidad backend) */}
        <input type="hidden" name="slug" value={slug} />
        {/* Ciudad oculta por ahora */}
        <input type="hidden" name="city" value={cityDefault} />

        {/* Categoría con 'Otra' */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr]">
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name="category_slug"
            className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          >
            <option value="" disabled>
              Categoría
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>

          {category === "otras" && (
            <input
              required
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              name="other_category_detail"
              placeholder="¿Cuál? (describe la categoría)"
              className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
            />
          )}
        </div>

        {/* Rango de precio (opcional) */}
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            name="price_min"
            placeholder="Precio mínimo (opcional)"
            inputMode="numeric"
            className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          />
          <input
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            name="price_max"
            placeholder="Precio máximo (opcional)"
            inputMode="numeric"
            className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          />
        </div>

        {/* Bio única (replicamos a ES/EN en oculto) */}
        <textarea
          required
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          name="bio"
          placeholder="Bio corta (quién eres y qué haces)"
          rows={4}
          className="w-full rounded-xl border border-[var(--cloud)] bg-white p-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
        />
        <input type="hidden" name="bio_es" value={bio} />
        <input type="hidden" name="bio_en" value={bio} />

        {/* Política de servicio (opcional, reemplaza SLA) */}
        <div>
          <input
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            name="sla_es"
            placeholder="Política de servicio (opcional) — ej.: anticipo 50%, cancelaciones 72h antes, cobertura Mazatlán y alrededores"
            className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          />
          <input type="hidden" name="sla_en" value={policy} />
        </div>

        {/* Etiquetas con ejemplo */}
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          name="tags"
          placeholder="Etiquetas separadas por coma (ej. inflables, princesas, mesas de dulces)"
          className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
        />

        {/* Contacto obligatorio */}
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email de contacto"
            className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            name="phone"
            placeholder="Teléfono de contacto"
            inputMode="tel"
            className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          />
        </div>
        <input type="hidden" name="corporate_email" value={email} />
        <input type="hidden" name="response_time_min" value="" />

        {/* Autorización + Evidencias */}
        <div className="rounded-2xl border border-[var(--cloud)] bg-white/60 p-4">
          <div className="font-medium text-[var(--ink)]">Autorización</div>

          <div className="mt-3 grid gap-3">
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "propietario" | "representante")
              }
              name="authorization_role"
              className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
            >
              <option value="propietario">Propietario</option>
              <option value="representante">Representante</option>
            </select>

            <input
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              name="legal_name"
              placeholder="Nombre legal / Razón social (opcional)"
              className="h-12 w-full rounded-xl border border-[var(--cloud)] bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
            />

            {/* Evidencias requeridas */}
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm text-brand-slate">
                  INE (frente) *
                </label>
                <input
                  required
                  type="file"
                  accept="image/*,.pdf"
                  name="ine_front"
                  onChange={(e) => setIneFront(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full rounded-xl border border-[var(--cloud)] bg-white p-2"
                />
              </div>
              <div>
                <label className="text-sm text-brand-slate">
                  INE (reverso) *
                </label>
                <input
                  required
                  type="file"
                  accept="image/*,.pdf"
                  name="ine_back"
                  onChange={(e) => setIneBack(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full rounded-xl border border-[var(--cloud)] bg-white p-2"
                />
              </div>
              <div>
                <label className="text-sm text-brand-slate">
                  Comprobante de domicilio (negocio o domicilio del proveedor) *
                </label>
                <input
                  required
                  type="file"
                  accept="image/*,.pdf"
                  name="proof_of_address"
                  onChange={(e) => setProofAddress(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full rounded-xl border border-[var(--cloud)] bg-white p-2"
                />
              </div>
              <div>
                <label className="text-sm text-brand-slate">
                  Constancia de situación fiscal (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  name="tax_certificate"
                  onChange={(e) => setTaxCert(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full rounded-xl border border-[var(--cloud)] bg-white p-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-brand-slate">
                  Selfie sosteniendo la INE (rostro visible, sin gorras ni lentes) *
                </label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  name="selfie_with_id"
                  onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full rounded-xl border border-[var(--cloud)] bg-white p-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-brand-slate">
                Imágenes del negocio (3–6) — producto/servicio; se permiten algunas con info de paquetes
              </label>
              <input
                required
                multiple
                type="file"
                accept="image/*"
                name="business_images"
                onChange={(e) => setBizImages(e.target.files)}
                className="mt-1 block w-full rounded-xl border border-[var(--cloud)] bg-white p-2"
              />
              {!imagesCountValid && (
                <div className="mt-1 text-sm text-red-600">
                  Sube entre 3 y 6 imágenes. Actualmente: {imagesCount}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flags de revisión/visibilidad */}
        <input type="hidden" name="verification_status" value="pending_review" />
        <input type="hidden" name="is_visible" value="false" />
        <input type="hidden" name="review_required" value="true" />

        <button
          type="submit"
          disabled={!isValid}
          className="h-12 w-full rounded-xl bg-[var(--brand-primary)] font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Enviar registro
        </button>
      </form>

      <div className="mt-6 text-sm text-brand-slate">
        Al enviar este formulario, tu perfil quedará <b>en revisión</b>. No será
        visible hasta que nuestro equipo verifique tu identidad y documentación.
      </div>

      <div className="mt-6">
        <Link href={`/${locale}/`} className="text-sm underline">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
