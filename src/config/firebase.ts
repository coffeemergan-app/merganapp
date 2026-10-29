export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB6j6D1AlTib9zbcZ0OGMLHUG8jmyIeCe8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "merganapp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "merganapp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "merganapp.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "425997180568",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:425997180568:web:7457c558d9753b8c4ebaed"
};
