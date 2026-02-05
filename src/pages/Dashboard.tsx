import { useState, useEffect, type FC } from 'react';
import {
    FaUsers,
    FaBookOpen,
    FaUserTie,
    FaCreditCard,
    FaRegClock,
    FaUserPlus,
    FaMoneyBillWave,
    FaLayerGroup
} from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const StatCard = ({ icon: Icon, label, value, color, loading }: any) => (
    <div className="stat-card-modern glass-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
            <Icon size={22} />
        </div>
        <div className="stat-info">
            <p className="stat-label-modern">{label}</p>
            <h3 className="stat-value-modern">{loading ? '...' : value}</h3>
        </div>
        <div className="stat-accent" style={{ backgroundColor: color }}></div>
    </div>
);

const Dashboard: FC = () => {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        courses: 0,
        groups: 0,
        revenue: 0,
        loading: true
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);

    const fetchStats = async () => {
        try {
            const [
                { count: studentsCount },
                { count: teachersCount },
                { count: coursesCount },
                { count: groupsCount },
                { data: paymentsData }
            ] = await Promise.all([
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('teachers').select('*', { count: 'exact', head: true }),
                supabase.from('courses').select('*', { count: 'exact', head: true }),
                supabase.from('groups').select('*', { count: 'exact', head: true }),
                supabase.from('payments').select('amount')
            ]);

            const totalRevenue = paymentsData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

            setStats({
                students: studentsCount || 0,
                teachers: teachersCount || 0,
                courses: coursesCount || 0,
                groups: groupsCount || 0,
                revenue: totalRevenue,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const fetchActivities = async () => {
        setLoadingActivities(true);
        try {
            // Fetch recent items from different tables with correct snake_case fields
            const [
                { data: recentStudents },
                { data: recentPayments },
                { data: recentGroups }
            ] = await Promise.all([
                supabase.from('students').select('id, full_name, registration_date').order('registration_date', { ascending: false }).limit(5),
                supabase.from('payments').select('id, amount, date, students(full_name)').order('date', { ascending: false }).limit(5),
                supabase.from('groups').select('id, name, created_at').order('created_at', { ascending: false }).limit(5)
            ]);

            // Combine and format activities
            const combined: any[] = [
                ...(recentStudents || []).map(s => ({
                    id: `s-${s.id}`,
                    type: 'student',
                    title: 'Новый студент',
                    description: `Зарегистрирован студент: ${s.full_name}`,
                    date: new Date(s.registration_date),
                    icon: FaUserPlus,
                    color: '#6366f1'
                })),
                ...(recentPayments || []).map(p => ({
                    id: `p-${p.id}`,
                    type: 'payment',
                    title: 'Новый платеж',
                    description: `Получена оплата ${p.amount.toLocaleString()}₽ 
                        }`,
                    date: new Date(p.date),
                    icon: FaMoneyBillWave,
                    color: '#10b981'
                }))
                ,
                ...(recentGroups || []).map(g => ({
                    id: `g-${g.id}`,
                    type: 'group',
                    title: 'Новая группа',
                    description: `Создана группа: ${g.name}`,
                    date: new Date(g.created_at),
                    icon: FaLayerGroup,
                    color: '#f59e0b'
                }))
            ];

            // Sort by date and take latest 8
            setActivities(combined.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8));
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoadingActivities(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchActivities();
    }, []);

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes} мин. назад`;
        if (hours < 24) return `${hours} ч. назад`;
        return `${days} дн. назад`;
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="page-title">Дашборд</h1>
                <p className="page-subtitle">Обзор активности и ключевые показатели EDU CRM</p>
            </div>

            <div className="stats-grid-modern">
                <StatCard
                    icon={FaUsers}
                    label="Студенты"
                    value={stats.students.toLocaleString()}
                    color="#6366f1"
                    loading={stats.loading}
                />
                <StatCard
                    icon={FaBookOpen}
                    label="Курсы"
                    value={stats.courses.toLocaleString()}
                    color="#ec4899"
                    loading={stats.loading}
                />
                <StatCard
                    icon={FaLayerGroup}
                    label="Группы"
                    value={stats.groups.toLocaleString()}
                    color="#f59e0b"
                    loading={stats.loading}
                />
                <StatCard
                    icon={FaCreditCard}
                    label="Доход (₽)"
                    value={stats.revenue.toLocaleString()}
                    color="#10b981"
                    loading={stats.loading}
                />
            </div>

            <div className="dashboard-content-grid">
                <div className="activity-container glass-card">
                    <div className="container-header">
                        <div className="header-title">
                            <FaRegClock className="header-icon" />
                            <h2>История активности</h2>
                        </div>
                        <button className="refresh-btn" onClick={fetchActivities}>Обновить</button>
                    </div>

                    <div className="activity-list">
                        {loadingActivities ? (
                            <div className="loading-activities">Загрузка...</div>
                        ) : activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-icon-box" style={{ color: activity.color, backgroundColor: `${activity.color}15` }}>
                                        <activity.icon />
                                    </div>
                                    <div className="activity-details">
                                        <div className="activity-main">
                                            <span className="activity-title">{activity.title}</span>
                                            <span className="activity-time">{formatTimeAgo(activity.date)}</span>
                                        </div>
                                        <p className="activity-desc">{activity.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-activities">Нет недавней активности</div>
                        )}
                    </div>
                </div>

                <div className="quick-stats-container glass-card">
                    <div className="container-header">
                        <div className="header-title">
                            <FaUserTie className="header-icon" />
                            <h2>Штат</h2>
                        </div>
                    </div>
                    <div className="staff-overview">
                        <div className="stat-row">
                            <span>Преподаватели</span>
                            <strong>{stats.teachers}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Администраторы</span>
                            <strong>1</strong>
                        </div>
                        <div className="total-staff">
                            <span>Всего сотрудников</span>
                            <strong>{stats.teachers + 1}</strong>
                        </div>
                    </div>
                    <div className="dashboard-promo">
                        <p>EduCRM v2.0 - Ваша система управления образовательным центром стала еще удобнее!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
