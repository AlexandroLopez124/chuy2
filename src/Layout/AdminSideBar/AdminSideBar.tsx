import { MdPendingActions } from "react-icons/md";
import { FaTshirt, FaClipboardCheck } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/User/UserContext';
import './AdminSideBar.css';

const AdminSideBar: React.FC = () => {
  const {
    state: { user },
  } = useUserContext();

  const linkData = [
    { to: 'management', text: 'Gestionar Camisetas', icon: <FaTshirt /> },
    { to: 'order', text: 'Confirmar entregas', icon: <FaClipboardCheck /> },
    { to: 'pending', text: 'Pedidos Pendientes', icon: <MdPendingActions /> },
  ];
  return (
    <div className='profile-sidebar'>
      <h2 className='profile-sidebar__title'>Hola {user.displayName}</h2>
      <div className='profile-sidebar__links'>
        {linkData.map((link, i) => (
          <Link
            key={i}
            className={`profile-sidebar__link ${window.location.pathname.split('/')[2] === link.to ? 'active' : ''}`}
            to={link.to}
          >
            <div className='profile-sidebar__link-content'>
              {link.text}
              {link.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSideBar;
