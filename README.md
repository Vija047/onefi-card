 # 1Fi Marketplace

 A full-stack product marketplace demo for the 1Fi SDE assignment. The frontend is a React/Vite application for browsing products, selecting a product variant, reviewing EMI plans, and confirming a selected plan. The backend is an Express API backed by PostgreSQL and Prisma.

 ## Live Application

 - Frontend: [https://onefi-card.vercel.app/](https://onefi-card.vercel.app/)
 - Backend: [https://onefi-card.onrender.com](https://onefi-card.onrender.com)
 - Backend health check: [https://onefi-card.onrender.com/](https://onefi-card.onrender.com/)
 - Production products endpoint: [https://onefi-card.onrender.com/api/products](https://onefi-card.onrender.com/api/products)

 ## Features

 - Browse the product catalogue from the Shop or Marketplace page.
 - Open a product detail page by its slug.
 - View product pricing, variants, images, and EMI plans.
 - Select a color, storage option, and EMI plan.
 - Review the selected purchase details in a confirmation modal.
 - Loading, empty-state, retry, invalid-slug, and not-found handling.

 This is a demo marketplace. The confirmation action does not create an order, process a payment, or persist a purchase in the database.

 ## Technology Stack

 ### Frontend

 - React 19
 - React Router 7
 - Vite 8
 - Tailwind CSS 4 with the Vite plugin

 ### Backend

 - Node.js
 - Express 5
 - Prisma 6
 - PostgreSQL
 - `pg` connection pool
 - `cors` and `dotenv`

 ## Project Structure

 ```text
 .
 ├── backend/
 │   ├── config/              # PostgreSQL and Prisma clients
 │   ├── controllers/         # Product query and response serialization
 │   ├── middleware/          # 404 and error handling
 │   ├── prisma/              # Schema, migrations, and seed data
 │   ├── routes/              # Express route definitions
 │   ├── index.js              # API server entry point
 │   ├── render.yaml           # Render service configuration
 │   └── package.json
 ├── frontend/
 │   ├── src/api/              # API client functions
 │   ├── src/components/       # Reusable UI components
 │   ├── src/pages/            # Shop, Marketplace, and Product Detail
 │   ├── src/App.jsx           # Client-side routes
 │   └── package.json
 └── README.md
 ```

 ## Application Flow

 ```mermaid
 flowchart LR
		 User[User] --> Shop[Shop / Marketplace]
		 Shop -->|GET /api/products| API[Express API]
		 API --> Prisma[Prisma Client]
		 Prisma --> DB[(PostgreSQL)]
		 DB --> Prisma --> API --> Shop
		 User --> Detail[Product Detail]
		 Detail -->|GET /api/products/:slug| API
		 Detail --> Variant[Select variant]
		 Variant --> EMI[Select EMI plan]
		 EMI --> Confirm[Confirmation modal]
		 Confirm -. demo only, no order API .-> User
 ```

 1. The React app reads `VITE_API_URL` and requests the catalogue.
 2. The API loads products with their variants and EMI plans through Prisma.
 3. The listing endpoint returns summary fields and the first variant image.
 4. Selecting a product navigates to `/products/:slug`.
 5. The detail endpoint validates the slug and returns the complete product record.
 6. Variant and EMI selections are held in React state. The final confirmation is currently a UI-only interaction.

 ## Database Schema

 PostgreSQL contains three related tables:

 ```mermaid
 erDiagram
		 Product ||--o{ ProductVariant : has
		 Product ||--o{ EmiPlan : offers

		 Product {
			 int id PK
			 string name
			 string slug UK
			 string description
			 decimal mrp
			 decimal price
			 datetime createdAt
			 datetime updatedAt
		 }
		 ProductVariant {
			 int id PK
			 int productId FK
			 string color
			 string storage
			 string imageUrl
				 decimal mrp
				 decimal price
		 }
		 EmiPlan {
			 int id PK
			 int productId FK
			 decimal monthlyPayment
			 int tenureMonths
			 decimal interestRate
			 decimal cashback
		 }
 ```

 - `Product.slug` is unique and is used by the detail route.
 - A product can have many `ProductVariant` records and many `EmiPlan` records.
 - Deleting a product cascades to its variants and EMI plans.
 - Monetary values use Prisma `Decimal` and are converted to numbers in API responses.
 - `ProductVariant.imageUrl` stores the image displayed for a selected variant.
- `ProductVariant.mrp` and `ProductVariant.price` store storage-specific pricing.
 - `EmiPlan.cashback` and `Product.description` are optional.

 ## API Reference

 ### `GET /`

 Returns `backend running....` and can be used as a basic service health check.

 ### `GET /api/products`

 Returns listing summaries:

 ```json
 {
	 "products": [
		 {
			 "id": 1,
			 "name": "iPhone 17 Pro",
			 "slug": "iphone-17-pro",
			 "description": "...",
			 "mrp": 149900,
			 "price": 134900,
			 "imageUrl": "https://...",
			 "variantCount": 3,
			 "emiPlanCount": 3,
			 "startingEmi": 4249
		 }
	 ]
 }
 ```

 ### `GET /api/products/:slug`

 Returns one product with its complete `variants` and `emiPlans` arrays. Slugs must contain lowercase letters, numbers, and single hyphens, for example `iphone-17-pro`.

 - `400`: invalid slug format
 - `404`: product does not exist
 - `500`: unexpected server or database error

 ## Local Installation

 ### Prerequisites

 - Node.js 18 or newer
 - npm
 - A PostgreSQL database, local or hosted

 ### 1. Clone and enter the repository

 ```bash
 git clone <repository-url>
 cd 1fi-sde1
 ```

 ### 2. Configure the backend

 ```bash
 cd backend
 npm install
 ```

 Create `backend/.env`:

 ```env
 DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
 PORT=3000
 ```

 Apply migrations, generate the Prisma client, and load the demo products:

 ```bash
 npx prisma generate
 npx prisma migrate deploy
 npm run db:seed
 ```

 For local development, `npm run db:migrate` can create/apply a development migration when the schema changes.

 ### 3. Start the backend

 From `backend/`:

 ```bash
 npm run dev
 ```

 The API runs at `http://localhost:3000` by default. `npm start` runs the production-style Node process.

 ### 4. Configure and start the frontend

 In a second terminal:

 ```bash
 cd frontend
 npm install
 ```

 Create `frontend/.env` for local development:

 ```env
 VITE_API_URL=http://localhost:3000
 ```

 Start Vite:

 ```bash
 npm run dev
 ```

 Open the local URL printed by Vite, usually `http://localhost:5173`.

 `VITE_API_URL` defaults to `http://localhost:3000` when it is not set. Vite exposes variables to the browser at build time, so set the production value before building or deploying the frontend.

 ## Production Deployment

 ### Backend on Render

 The backend includes [`backend/render.yaml`](backend/render.yaml) with the following deployment sequence:

 1. Install dependencies.
 2. Generate the Prisma client.
 3. Run committed migrations with `prisma migrate deploy`.
 4. Start the API with `npm start`.

 Configure `DATABASE_URL` as a secret environment variable containing the production PostgreSQL connection string. The service uses Render's `PORT` when supplied by the platform.

 ### Frontend on Vercel

 Configure the Vercel project with `frontend/` as its root directory, then set:

 ```env
 VITE_API_URL=https://onefi-card.onrender.com
 ```

 Use `npm run build` as the build command and `dist` as the output directory. The production frontend at [onefi-card.vercel.app](https://onefi-card.vercel.app/) calls the Render API using this variable.

 ## Useful Commands

 | Directory | Command | Purpose |
 | --- | --- | --- |
 | `backend` | `npm run dev` | Start the API with Nodemon |
 | `backend` | `npm start` | Start the API with Node |
 | `backend` | `npm run db:generate` | Generate the Prisma client |
 | `backend` | `npm run db:migrate` | Run a development migration |
 | `backend` | `npm run db:seed` | Replace demo data with seed data |
 | `frontend` | `npm run dev` | Start the Vite development server |
 | `frontend` | `npm run build` | Create a production build |
 | `frontend` | `npm run lint` | Run ESLint |
 | `frontend` | `npm run preview` | Preview the production build locally |

 ## Notes

 - Do not commit `.env` files or database credentials.
 - The seed script deletes existing products, variants, and EMI plans before inserting the demo catalogue, so treat it as destructive for that data.
 - Product images are external URLs stored in the seed data.
 - CORS is enabled by the backend for the browser frontend.
