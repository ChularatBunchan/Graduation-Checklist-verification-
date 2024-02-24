import styles from '@/styles/Home.module.css'
import { Button } from '@material-tailwind/react';

const Login = () => {
    return (
        <center>
           <div className={`${styles.Login}`}>
            <form>
                    <label>ICIT Account</label><br />
                    <input></input><br />
                    <label>Password</label><br />
                    <input type="password"></input><br />
                    <h5>forgot password?</h5>
                    <Button>Sign in</Button>
            </form>
        </div> 
        </center>
        
    )
}
export default Login;