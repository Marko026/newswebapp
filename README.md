# News Website

Dvojezični editorial news sajt sa arapskim RTL i engleskim LTR prikazom.

## Lokalno pokretanje

1. Kopiraj `.env.example` u `.env.local` i promeni `PAYLOAD_SECRET` u dugu nasumičnu vrednost.
2. Ostavi `DB_DRIVER=sqlite` za lokalni razvoj.
3. Pokreni aplikaciju:

```powershell
npm run dev
```

Javni sajt:

- `http://localhost:3000/ar`
- `http://localhost:3000/en`

CMS:

- `http://localhost:3000/admin`

Pri prvom pokretanju Payload prikazuje `/admin/create-first-user`. Taj prvi nalog se automatski postavlja kao `owner`; svi kasniji nalozi ostaju `editor` dok ih owner ručno ne kreira ili odobri kroz workflow.

Za production first-owner setup ne ostavljaj javno otvorenim: privremeno postavi `ALLOW_FIRST_USER_SETUP=true` samo tokom privatnog provisioning prozora, kreiraj ownera, zatim promenljivu vrati na `false` i redeployuj.

## Provere

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run payload:types
npm run payload:importmap
```

`npm test` proverava osnovne ugovore projekta: verification skripte, lokalizovani server layout, pristupacne forme i zabranu poznatog Payload placeholder secret-a.

Objavljeni frontend koristi Payload kao primarni izvor za objavljene price, teme i autore. Checked-in fixture podaci se koriste samo kao bootstrap fallback kada lokalni CMS jos nema objavljene dokumente ili tokom build-a bez baze.

Za production server obavezno postavi `PAYLOAD_SECRET` (najmanje 32 karaktera i ne placeholder), `NEXT_PUBLIC_SITE_URL`, `DB_DRIVER=postgres` i `DATABASE_URL`. Production runtime namerno prekida start ako bilo koji od ovih uslova nije ispunjen. Ako koristiš S3/R2, postavi i `S3_BUCKET`, `S3_ENDPOINT` i `NEXT_PUBLIC_MEDIA_ORIGIN`; aplikacija odbija nepotpunu media konfiguraciju umesto da generise neispravne URL-ove. `TRUST_PROXY=true` ukljuci samo kada reverse proxy pouzdano upisuje `x-forwarded-for`.

CI workflow u `.github/workflows/ci.yml` pokrece lint, typecheck, contract testove i production build.

`GET /api/health` je liveness provera servera. `GET /api/health?ready=1` je
readiness provera i vraća `200` samo kada su Payload baza i Upstash Redis
dostupni; u suprotnom vraća `503` bez detalja o infrastrukturi.

Objavljeni frontend je dizajniran da ostane čitljiv i kada CMS nije dostupan; CMS i public rendering su odvojeni route boundary-jem.
