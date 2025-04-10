import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { db } from '../../config/firebase.config';
import { useLoader } from '../../context/Loader/LoaderContext';
import { useUserContext } from '../../context/User/UserContext';
import useToast from '../../hook/useToast';
import './AdminPending.css';

const AdminPending: React.FC = () => {
  return (
    <div className='profile-setting'>
      <div className='profile-setting__head'>
        <h2 className='profile-setting__title'>Pedidos Pendientes</h2>
      </div>
    </div>
  );
};

export default AdminPending;
