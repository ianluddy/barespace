# Barespace

A modern salon booking application built with Next.js, Prisma, and SQLite.

## Features

- Book appointments with your preferred stylist
- View available services and staff
- Manage appointments through a chatbot interface
- Multiple salon locations
- Real-time availability checking

## Tech Stack

- Next.js 14 (App Router)
- Prisma ORM
- SQLite Database
- Tailwind CSS

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
DATABASE_URL="file:./dev.db"
```

## License

MIT
