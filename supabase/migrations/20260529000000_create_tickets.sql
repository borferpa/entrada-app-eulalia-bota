-- =============================================================
-- Taula principal: tickets
-- Conté les entrades, begudes, aigues i gelats de la festa.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.tickets (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_moviment   TEXT          NOT NULL,
  titular        TEXT          NOT NULL,
  concepte       TEXT          NOT NULL,
  categoria      TEXT          NOT NULL,   -- entrada | refresc | aigua | gelat
  tipus          TEXT          NOT NULL,   -- ex: Cobrament
  data_emissio   DATE          NOT NULL,
  data_venciment DATE          NOT NULL,
  forma_pagament TEXT          NOT NULL,
  import         NUMERIC(10,2) NOT NULL,
  pendent        NUMERIC(10,2) NOT NULL DEFAULT 0,
  estat          TEXT          NOT NULL CHECK (estat IN ('Pagat', 'Pendent')),
  entregada      BOOLEAN       NOT NULL DEFAULT FALSE,
  filtra         TEXT          NOT NULL,   -- any, ex: 2026
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- -------------------------------------------------------------
-- Actualitza updated_at automàticament en cada UPDATE
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tickets_set_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------------
-- Índexs per als filtres i cerques més habituals
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS tickets_estat_idx     ON public.tickets (estat);
CREATE INDEX IF NOT EXISTS tickets_categoria_idx ON public.tickets (categoria);
CREATE INDEX IF NOT EXISTS tickets_titular_idx   ON public.tickets (titular);
CREATE INDEX IF NOT EXISTS tickets_entregada_idx ON public.tickets (entregada);

-- -------------------------------------------------------------
-- Row Level Security
-- Lectures obertes (la app no requereix login).
-- Les escriptures van per service_role (API routes), que bypassa RLS.
-- -------------------------------------------------------------
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets_select_all"
  ON public.tickets FOR SELECT
  USING (true);
