import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import React from 'react';
import Hello from './component/Hello';
import HeaderBarOff from './component/Officer/HeaderbarOff';
import Profile from './component/Profile';

const Home = () => {

  return (
    <div>
      <Head>
        <title>CSB's Graduate checking</title>
        <link rel="icon" type="image/png" href="/logo_kmutnb.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Anuphan&family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
        <script src="https://kit.fontawesome.com/6ed1a5c649.js" crossOrigin="anonymous"></script>
      </Head>

      <main className={`${styles.main}`}>
        <Hello />
      </main>

      
    </div>
  );
}

export default Home;
