# Sparebace

[Sparebace](https://sparebace.vercel.app/) - a modern salon booking application built Next.js, Prisma and PostgreSQL.

[Vercel](https://vercel.com) for automated deployments, logging, analytics.

[Neon](https://neon.tech/) for serverless Postgres hosting.

[Stripe](https://stripe.com/) for payments.

## Features

- Book appointments for your chosen stylist, service and salon
- Manage appointments through a chatbot interface with voice recognition (not on iOS)
- Real-time availability checking

## Tech Stack

- Next.js 14
- Prisma ORM
- PostgreSQL
- Styled-components
- Nodemailer
- Vercel
- NeonDB
- Stripe

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

3. Create a `.env` file in the root directory with the following variables:
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

4. Set up the database
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.


## License

MIT
