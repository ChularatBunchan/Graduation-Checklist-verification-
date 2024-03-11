import { useState } from 'react';
import '@/styles/globals.css';
import Layout from './component/Layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false); // State to manage login status
  const router = useRouter();

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout actions here (e.g., clearing local storage, resetting state)
    setLoggedIn(false);
    router.push('/Login'); // Redirect to login page after logout
  };

  // Function to handle login
  const handleLogin = () => {
    // Perform login actions here (e.g., setting local storage, updating state)
    setLoggedIn(true);
    router.push('/Hello'); // Redirect to profile page after login
  };

  return (
    <Layout loggedIn={loggedIn} onLogin={handleLogin} onLogout={handleLogout}>
      <Component {...pageProps} />
    </Layout>
  );
}
