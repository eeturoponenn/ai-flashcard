# AI Flashcard App

A web application that helps users create, manage, and practice flashcards using AI-powered automation. The app supports user authentication, deck management, and AI-generated flashcards to make card creation faster.

## Features

- AI-generated flashcards based on user input
- User authentication (sign up, login, password management)
- Deck creation and management
- Secure backend with PostgreSQL, Prisma & NextAuth.js

## Tech Stack

- **Frontend:** Next.js (React, TypeScript)
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js (Credentials Provider)
- **Styling:** Tailwind CSS
- **AI Integration:** OpenAI API

## Deployment  

The application is hosted on **Vercel** and can be accessed at:  

[https://ai-flashcard-alpha.vercel.app](https://ai-flashcard-alpha.vercel.app)

## Usage

### 1. Create an Account & Log In
Users can sign up with their email and password to access their personal flashcards.

### 2. Generate Flashcards with AI
- Enter a topic, and the AI generates question-answer pairs automatically.
- Review, edit, or delete the flashcards before saving them.

### 3. Organize Flashcards in Decks
Users can create, update, and delete decks to categorize their study material.

### 4. Practice Mode (Planned Feature)
A simple interface to review flashcards and test knowledge.

## Gettin Started

### 1. Clone the repository

git clone https://github.com/your-username/ai-flashcard-app.git
cd ai-flashcard-app

### 2. Install dependencies

npm install

### 3. Set up environment variables

Create a .env file in the root directory and add the necessary environment variables:

NEXTAUTH_SECRET=your-nextauth-secret
DATABASE_URL=your-database-url
OPENAI_API_KEY=your-openai-api-key

### 4. Run the database migrations

npx prisma migrate dev

### 5. Start the development server

npm run dev

The app should now be running on http://localhost:3000.

