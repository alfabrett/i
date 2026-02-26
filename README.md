# Criteru (MVP)

Plataforma SaaS full-stack para gestión y evaluación de convocatorias.

## Stack
- Next.js 14 + TypeScript + Tailwind
- API Routes en Next.js
- Prisma + PostgreSQL
- NextAuth (credenciales email/password)
- Almacenamiento local para PDFs (preparado para migrar a S3)
- OpenAI con capa modular en `src/lib/ai.ts`

## Requisitos
- Node.js 20+
- PostgreSQL local

## Configuración
1. Copia variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Ajusta `DATABASE_URL`, `NEXTAUTH_SECRET` y opcionalmente `OPENAI_API_KEY`.
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Genera cliente Prisma y migra:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```
5. Arranca en local:
   ```bash
   npm run dev
   ```

## Flujo MVP implementado
1. Registro/Login con roles `ADMIN` y `EVALUADOR`.
2. `ADMIN` crea convocatoria y sube bases PDF (`/api/convocatorias`) con extracción IA `extractBases()`.
3. Subida de criterios PDF por endpoint `/api/convocatorias/:id/extract-criterios` y guardado de criterios estructurados.
4. Alta de solicitudes con memoria PDF (`/api/solicitudes`).
5. Evaluación por criterios con actualización automática de `puntuacionTotal` (`/api/evaluaciones`).
6. Generación de informe técnico automático (`/api/informes`).
7. Dashboard agregado (`/api/dashboard` + `/dashboard`).

## Estructura clave
- `src/lib/ai.ts`: funciones IA reutilizables (`extractBases`, `extractCriterios`, `generateInforme`)
- `src/lib/pdfExtractor.ts`: extracción de texto PDF
- `src/lib/storage.ts`: guardado local de archivos
- `prisma/schema.prisma`: modelo de datos completo

## Despliegue
Compatible con Vercel (definir variables de entorno y base de datos gestionada PostgreSQL).
