# Sparebace

A modern salon booking application built with Next.js, Prisma, and PostgreSQL.

https://sparebace.vercel.app/

## Features

- Book appointments with your preferred stylist
- View available services and staff
- Manage appointments through a chatbot interface
- Multiple salon locations
- Real-time availability checking

## Tech Stack

- Next.js 14 (App Router)
- Prisma ORM
- PostgreSQL
- Styled-components
- Vercel
- NeonDB

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/barespace.git
cd barespace
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npx prisma migrate dev
```

4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
# Local PostgreSQL connection
DATABASE_URL={postgres_connection_string}

# Email
SMTP_USER={smtp_user}
SMTP_PASS={smtp_pass}
SMTP_FROM={smpt_from}

# Stripe
STRIPE_SECRET_KEY={stripe_secret_key}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY={stripe_publishable_key}
NEXT_PUBLIC_BASE_URL={local_or_prod_url}
```

## License

MIT
