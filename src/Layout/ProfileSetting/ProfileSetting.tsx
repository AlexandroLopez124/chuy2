import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { db } from '../../config/firebase.config';
import { useLoader } from '../../context/Loader/LoaderContext';
import { useUserContext } from '../../context/User/UserContext';
import useToast from '../../hook/useToast';
import './ProfileSetting.css';
import { useState } from 'react';



const ProfileSetting: React.FC = () => {
  const { dispath } = useUserContext();
  const { setLoader } = useLoader();
  const auth = getAuth();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const { errorToast, succsesToast } = useToast();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      setLoader(true);
      await signOut(auth);
      dispath({ type: 'LOG_OUT' });
      succsesToast('Saliste exitosamente', '');
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
      ]
    );     
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
          {showConfirmDelete && (
      <div className="confirm-overlay">
        <div className="confirm-modal">
          <h3>¿Estás seguro de que deseas borrar tu cuenta?</h3>
          <p>Esta acción es permanente y eliminará todos tus datos.</p>
          <div className="confirm-buttons">
            <Button onClick={handleDeleteAccount} className="confirm-button">
              Sí, borrar
            </Button>
            <Button onClick={() => setShowConfirmDelete(false)} className="cancel-button">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    )};
          {showConfirmLogout && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>¿Estás seguro de que deseas salir?</h3>
            <p>Se cerrará tu sesión actual y volverás al inicio.</p>
            <div className="confirm-buttons">
              <Button
                onClick={handleLogOut}
                className="confirm-button"
              >
                Sí, salir
              </Button>
              <Button
                onClick={() => setShowConfirmLogout(false)}
                className="cancel-button"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )};
      <div className='profile-setting__head'>
        <h2 className='profile-setting__title'>Configuración</h2> </div>
        <hr className='profile-setting_line' />
        <div className='profile-setting__content'>
  <h4 className='profile-setting__logout-text'>Salir de la tienda</h4>
        <Button onClick={() => setShowConfirmLogout(true)} >Salir</Button>
        </div>
    </div>
  );
};

export default ProfileSetting;
