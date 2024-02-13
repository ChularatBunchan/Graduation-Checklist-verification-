import styles from '@/styles/Home.module.css'
import { Button } from '@material-tailwind/react';

const Login = () => {
    return (
        <div className={`${styles.Login}`}>
            <form>
                <center>
                    <label>ICIT Account</label><br />
                    <input></input><br />
                    <label>Password</label><br />
                    <input></input><br />
                    <h5>forgot password?</h5>
                    <Button>Login</Button>
                </center>
            </form>

        </div>
    )
}
export default Login;