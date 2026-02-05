import { type FC } from 'react';
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: FC = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="header">
            <div className="header-search">
                <FaSearch size={18} style={{ color: '#94a3b8' }} />
                <input type="text" placeholder="Поиск по CRM..." />
            </div>
            <div className="header-actions">
                <div className="divider"></div>
                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">Админ</span>
                        <span className="user-role">{user?.email || 'Администратор'}</span>
                    </div>
                    <div className="avatar">
                        <FaUser size={20} style={{ color: '#6366f1' }} />
                    </div>
                    <button className="action-btn ml-2" onClick={signOut} title="Выйти">
                        <FaSignOutAlt size={20} style={{ color: '#ef4444' }} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
