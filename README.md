This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend
Switch directory to `backend`

```bash
cd backend
```

Create the virtual env:

```bash
python3 -m venv venv
```

Activate venv:

```bash
source venv/bin/activate
```

Install the python packages from `requirements.txt`:

```bash
pip install < requirements.txt
```

Make sure you have the proper .env file with all the values filled:

```bash
cp .env.example .env
```

Run the backend app:

```bash
uvicorn main:app --reload
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) with your browser to see the result.

## OR
## Dockerize Backend

```bash
cd backend
```

Dockerize the app.
```bash
docker --debug build -t fastapi-backend .
```

Run the container.
```bash
docker run -d -p 8000:8000 --name ragapp fastapi-backend
```

## Frontend

First, run install the required npm packages:

```bash
npm install
```

Run the frontend application:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
