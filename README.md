
# Dale

Dale is a ride-sharing platform that connects drivers with passengers. This repository contains the mobile and web applications for Dale, as well as the shared packages and database schema.

## Tech Stack

Dale is built with a modern tech stack, including:

*   **[Turborepo](https://turbo.build/repo)**: High-performance build system for monorepos.
*   **[React](https://react.dev/)**: A JavaScript library for building user interfaces.
*   **[React Native](https://reactnative.dev/)**: A framework for building native apps with React.
*   **[Next.js](https://nextjs.org/)**: A React framework for building full-stack web applications.
*   **[Expo](https://expo.dev/)**: A framework and a platform for universal React applications.
*   **[Supabase](https://supabase.com/)**: The open source Firebase alternative.
*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
*   **[pnpm](https://pnpm.io/)**: Fast, disk space efficient package manager.

## Project Structure

This repository is a monorepo managed by Turborepo and pnpm. The project is organized into the following directories:

*   **`apps`**: Contains the main applications.
    *   **`mobile`**: A React Native (Expo) mobile application.
    *   **`web`**: A Next.js web application.
*   **`packages`**: Contains shared packages used by the applications.
    *   **`auth`**: Shared authentication logic using Supabase.
    *   **`config`**: Shared TypeScript configurations.
    *   **`core`**: Core business logic and types.
    *   **`ui`**: Shared UI components for both web and mobile.
*   **`supabase`**: Contains the database schema and migrations.

## Database Schema

The database is managed by Supabase. The schema is defined in the `supabase/migrations` directory. The main tables are:

*   **`profiles`**: Stores user information, including name, email, photo, and verification status.
*   **`trips`**: Stores ride-sharing trip details, including origin, destination, departure time, price, and available seats.
*   **`bookings`**: Connects users to trips they have booked, storing the number of seats and total price.

## Getting Started

To get started with this project, you will need to have the following installed:

*   [Node.js](https://nodejs.org/en/)
*   [pnpm](https://pnpm.io/installation)

You will also need to have a Supabase project set up.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/anarculture/dale.2.git
    cd dale.2
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Run the development servers:**

    To run the web and mobile apps in development mode, run the following command from the root of the project:

    ```bash
    pnpm dev
    ```

## Environment Variables

This project uses the following environment variables:

*   `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.

These variables are used by the Supabase client to connect to your Supabase project. You can find these values in the API settings of your Supabase project.
