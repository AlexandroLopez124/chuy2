import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { Login } from '../../components';
import './SignIn.css';
import GoogleAuth from '../../components/GoogleAuth/GoogleAuth';

const SignIn: React.FC = () => {
  return (
    <div className='login-background'>
      <Login>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='sign-in'>
          <h2 className='sign-in__title'>Sign in with Google</h2>
          <GoogleAuth />
        </motion.div>
      </Login>
    </div>
  );
};

export default SignIn;

