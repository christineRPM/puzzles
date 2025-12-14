# 🧩 Profile Puzzle Game

An interactive sliding puzzle game where you can log in with Twitter and turn your profile picture into a puzzle! Challenge yourself with different difficulty levels and track your progress.

## ✨ Features

- **Twitter Login:** Authenticate with your Twitter account
- **Personalized Puzzles:** Your Twitter profile picture becomes the puzzle image
- **Multiple Difficulties:** Choose from 3x3 (Easy) to 6x6 (Expert) puzzle sizes
- **Game Dashboard:** Track moves, time, progress, and view your wallet address
- **Responsive Design:** Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/christineRPM/dynamic-puzzle-game.git
   cd dynamic-puzzle-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here
   ```

   Get your environment ID from the [Dynamic Dashboard](https://app.dynamic.xyz).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to start playing!

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.5.9
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [Dynamic](https://docs.dynamic.xyz/) embedded wallets with Twitter login

