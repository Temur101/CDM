import type { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaChartPie,
    FaUserGraduate,
    FaBook,
    FaUsers,
    FaChalkboardTeacher,
    FaCreditCard,
    FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { icon: FaChartPie, label: 'Дашборд', path: '/', color: '#6366f1' },
    { icon: FaUserGraduate, label: 'Студенты', path: '/students', color: '#ec4899' },
    { icon: FaBook, label: 'Курсы', path: '/courses', color: '#f59e0b' },
    { icon: FaUsers, label: 'Группы', path: '/groups', color: '#10b981' },
    { icon: FaChalkboardTeacher, label: 'Преподаватели', path: '/teachers', color: '#3b82f6' },
    { icon: FaCreditCard, label: 'Платежи', path: '/payments', color: '#8b5cf6' },
];

const Sidebar: FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="/assets/logo.png" alt="SkillOrbit" className="logo-img" />
                <span className="logo-text">SkillOrbit</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} style={{ color: item.color }} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt size={20} style={{ color: '#ef4444' }} />
                    <span>Выйти</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
