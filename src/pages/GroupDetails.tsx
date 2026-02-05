import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaEdit,
    FaUserTie,
    FaUsers,
    FaCalendarAlt,
    FaGraduationCap,
    FaEnvelope,
    FaRegIdCard
} from 'react-icons/fa';
import { groupsService } from '../services/groups.service';
import { studentsService } from '../services/students.service';
import { teachersService } from '../services/teachers.service';
import './Groups.css';

const GroupDetails: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [teacherName, setTeacherName] = useState('Загрузка...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const groupData = await groupsService.getById(id);
                setGroup(groupData);

                // Fetch teacher name
                if (groupData.teacherId) {
                    try {
                        const teacher = await teachersService.getById(groupData.teacherId);
                        setTeacherName(teacher.fullName);
                    } catch (e) {
                        setTeacherName('Учитель не найден');
                    }
                }

                // Fetch group students
                const allStudents = await studentsService.getAll();
                const groupStudents = allStudents.filter(s => groupData.studentIds.includes(s.id));
                setStudents(groupStudents);
            } catch (error) {
                console.error('Error loading group details:', error);
                alert('Группа не найдена');
                navigate('/groups');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    if (loading) return <div className="loading-state">Загрузка информации...</div>;

    return (
        <div className="groups-page">
            <div className="page-header-actions">
                <div className="flex items-center gap-4">
                    <button className="icon-action-btn" onClick={() => navigate('/groups')}>
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="page-title">{group.name}</h1>
                        <p className="page-subtitle">Управление составом и расписанием</p>
                    </div>
                </div>
                <button className="add-btn" onClick={() => navigate(`/groups/edit/${group.id}`)}>
                    <FaEdit />
                    <span>Редактировать группу</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Карточка информации о группе */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                <FaRegIdCard size={20} />
                            </div>
                            <h3 className="text-xl font-bold color-main">О группе</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="detail-row-modern">
                                <div className="detail-icon teacher">
                                    <FaUserTie />
                                </div>
                                <div className="detail-content">
                                    <label>Преподаватель</label>
                                    <span>{teacherName}</span>
                                </div>
                            </div>

                            <div className="detail-row-modern">
                                <div className="detail-icon schedule">
                                    <FaCalendarAlt />
                                </div>
                                <div className="detail-content">
                                    <label>Расписание</label>
                                    <span>{group.schedule}</span>
                                </div>
                            </div>

                            <div className="detail-row-modern">
                                <div className="detail-icon students">
                                    <FaUsers />
                                </div>
                                <div className="detail-content">
                                    <label>Количество студентов</label>
                                    <span>{students.length} человек</span>
                                </div>
                            </div>

                            <div className="detail-row-modern">
                                <div className="detail-icon course">
                                    <FaGraduationCap />
                                </div>
                                <div className="detail-content">
                                    <label>ID Курса</label>
                                    <span>{group.courseId}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Таблица студентов */}
                <div className="lg:col-span-2">
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                    <FaUsers size={20} />
                                </div>
                                <h3 className="text-xl font-bold color-main">Список студентов</h3>
                            </div>
                        </div>

                        <div className="table-container-modern">
                            <table className="data-table-modern">
                                <thead>
                                    <tr>
                                        <th>Студент</th>
                                        <th>Контакты</th>
                                        <th>Статус</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id} onClick={() => navigate(`/students/${student.id}`)} className="cursor-pointer">
                                            <td>
                                                <div className="student-info-cell">
                                                    <div className="avatar-xs">{student.fullName.charAt(0)}</div>
                                                    <div>
                                                        <div className="font-bold color-main">{student.fullName}</div>
                                                        <div className="text-xs text-muted">ID: {student.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-column gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <FaEnvelope size={12} />
                                                        {student.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill-modern ${student.status === 'active' ? 'paid' : 'pending'}`}>
                                                    {student.status === 'active' ? 'Активен' : 'В ожидании'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-12 text-muted">
                                                В этой группе пока нет студентов
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;
