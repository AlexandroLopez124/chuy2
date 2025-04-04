import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { db } from '../../config/firebase.config';
import { useLoader } from '../../context/Loader/LoaderContext';
import { useUserContext } from '../../context/User/UserContext';
import useToast from '../../hook/useToast';
import './ProfileSetting.css';

const ProfileSetting: React.FC = () => {
  const { dispath } = useUserContext();
  const { setLoader } = useLoader();
  const auth = getAuth();
  const { errorToast, succsesToast } = useToast();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      setLoader(true);
      await signOut(auth);
      dispath({ type: 'LOG_OUT' });
      navigate('/');
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast('No puedes salirte', 'Intentelo de nuevo');
    }
  };
  const handleDeleteAccount = async () => {
    try {
      setLoader(true);
      await Promise.all([
        await deleteDoc(doc(db, 'users', auth.currentUser!.uid)),
        await deleteUser(auth.currentUser!),
        await signOut(auth),
      ]);
      succsesToast('Cuenta eliminada exitosamente', '');
      setLoader(false);
      dispath({ type: 'LOG_OUT' });
      navigate('/');
    } catch (error) {
      setLoader(false);
      errorToast('No puedes borrar la cuenta', 'Intentelo de nuevo');
    }
  };
  return (
    <div className='profile-setting'>
      <div className='profile-setting__head'>
        <h2 className='profile-setting__title'>Configuración</h2>
        <Button onClick={handleLogOut}>Salir</Button>
      </div>
      <hr className='profile-setting__line' />
      <div className='profile-setting__content'>
        <h4 className='profile-setting__text'>Borrar tu cuenta</h4>
        <p className='profile-setting__discription'>Se borrará todos sus pedidos, registro de usuario en el servidor </p>
        <Button onClick={handleDeleteAccount} className='profile-setting__delete-button'>
          Borrar cuenta
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetting;
