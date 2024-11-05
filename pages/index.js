// pages/index.js
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import React from 'react';
import Login from './Login';

const Home = () => {
  return (
    <div>
      <Head>
        <title>CSB's Graduate Checking</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/logo_kmutnb.png" />
      </Head>

      <main className={styles.main}>
        <Login />
      </main>
    </div>
  );
}

export default Home;
