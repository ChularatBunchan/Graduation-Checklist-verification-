import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { Button } from '@material-tailwind/react';

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        // Perform username and password validation here
        if (username === 'your_username' && password === 'your_password') {
            // If credentials are valid, redirect to the Hello page
            router.push('/Hello');
        } else {
            // If credentials are invalid, display error message
            setError('Invalid username or password');
        }
    }

    return (
        <center>
            <div className={`${styles.Login}`}>
                <form onSubmit={onSubmit}>
                    <label>ICIT Account</label><br />
                    <input value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                    <Link href='https://account.kmutnb.ac.th/web/recovery/index'>forgot password?</Link> <br />
                    <Button type='submit'>Sign in</Button>
                    {error && <p>{error}</p>} {/* Display error message if credentials are invalid */}
                </form>
            </div>
        </center>
    )
}

export default Login;
