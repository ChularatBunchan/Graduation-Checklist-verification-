import { useState } from 'react';
import '@/styles/globals.css';
import Layout from './component/Layout';
import { useRouter } from 'next/router';
import Login from './Login';

export default function App({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountType, setAccountType] = useState('');
  const router = useRouter();

  // Correctly define the handleLogin function
  const handleLogin = (status, type) => {
    setLoggedIn(status);
    setAccountType(type);
    router.push('/Hello');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setAccountType('');
    router.push('/Login');
  };

  return (
    <Layout>
    {/* <Layout loggedIn={loggedIn} accountType={accountType} onLogin={handleLogin} onLogout={handleLogout}> */}
      <Component {...pageProps} />
      {/* {loggedIn ? <Component {...pageProps} /> : <Login onLogin={handleLogin} />} */}
    </Layout>
  );
}
