# Next.js Application with Firebase Authentication and GIPHY API Integration

This README provides an overview of the Next.js application developed for the technical test, which incorporates Firebase Authentication for user login and registration and integrates the GIPHY API for GIF search functionality. Additionally, it outlines optional tasks that have been implemented hot searching, and adding loading animations.

## Project Overview

This project is a Next.js application that combines several technologies to create an interactive GIF search and gallery platform. It serves as a technical test for candidates to showcase their development skills. Key features of the project include:

### Authentication Requirements
- Users can log in using their email and password or create a new account.
- Firebase Authentication web SDK is used for implementing the authentication process.

### GIF Search and Gallery
- The application utilizes the GIPHY API to display a gallery of GIFs based on user-searched keywords.
- The GIPHY API key used for this project: `GlVGYHkr3WSBnllca54iNt0yFbjz7L65`

### Optional Task: Hot Search and Loading Animations
- Hot search feature: GIFs update dynamically as the user types, without requiring a separate search button click.
- Loading animations are added to enhance the user experience during data fetching.

## Authentication Requirements

To set up Firebase Authentication:
1. Create your own Firebase account at [Firebase](https://firebase.google.com/).
2. Configure Firebase in your application by providing the necessary Firebase credentials.

Reference for Firebase Authentication: [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)

## GIF Search and Gallery

The GIF search and gallery feature is powered by the GIPHY API. Users can enter keywords in the search bar, and the application will fetch and display relevant GIFs.

GIPHY API Documentation: [GIPHY API Docs](https://developers.giphy.com/docs/api)

## Optional Task: Hot Search and Loading Animations

- Hot search: GIFs update dynamically as the user types keywords in the search bar, without needing to press a separate search button.
- Loading animations: Users will experience visual feedback during data fetching operations to improve the overall user experience.

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Configure Firebase with your own credentials as per the Authentication Requirements section.
4. Set up the required environment variables in dotenv file.
   ```
    NEXT_PUBLIC_GIPHY_API_KEY=
    NEXT_PUBLIC_API_KEY=
    NEXT_PUBLIC_AUTH_DOMAIN=
    NEXT_PUBLIC_PROJECT_ID=
    NEXT_PUBLIC_STORAGE_BUCKET=
    NEXT_PUBLIC_MESSAGEING_SENDER_ID=
    NEXT_PUBLIC_APP_ID=
  
   ```
5. Start the application using `npm run dev`.
6. Access the application in your web browser at `http://localhost:3000`.

## Deployment

You have the option to deploy the application to a hosting platform of your choice, such as Vercel or GitHub Pages. Refer to the documentation of your chosen hosting service for deployment instructions.

