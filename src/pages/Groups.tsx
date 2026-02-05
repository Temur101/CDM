import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaCalendarAlt,
    FaUserTie,
    FaUsers,
    FaEdit,
    FaTrashAlt,
    FaUserPlus,
    FaSearch,
    FaSave,
    FaCheck
} from 'react-icons/fa';
import { groupsService } from '../services/groups.service';
import { coursesService } from '../services/courses.service';
import { teachersService } from '../services/teachers.service';
import { studentsService } from '../services/students.service';
import ModernModal from '../components/ModernModal';
import './Groups.css';

const Groups: FC = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Group Selection Modal (for adding student to group)
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [selectedGroupForEnroll, setSelectedGroupForEnroll] = useState<any>(null);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');

    // Group Form Modal
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        courseId: '',
        teacherId: '',
        schedule: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [g, c, t, s] = await Promise.all([
                groupsService.getAll(),
                coursesService.getAll(),
                teachersService.getAll(),
                studentsService.getAll()
            ]);
            setGroups(g);
            setCourses(c);
            setTeachers(t);
            setStudents(s);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openGroupModal = (group: any = null) => {
        if (group) {
            setSelectedGroup(group);
            setFormData({
                name: group.name,
                courseId: group.courseId,
                teacherId: group.teacherId,
                schedule: group.schedule
            });
        } else {
            setSelectedGroup(null);
            setFormData({
                name: '',
                courseId: '',
                teacherId: '',
                schedule: ''
            });
        }
        setGroupModalOpen(true);
    };

    const handleSaveGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedGroup) {
                await groupsService.update(selectedGroup.id, formData);
            } else {
                await groupsService.create(formData);
            }
            setGroupModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Ошибка при сохранении');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
            try {
                await groupsService.delete(id);
                fetchData();
            } catch (error: any) {
                alert(error.message || 'Ошибка при удалении');
            }
        }
    };

    const handleEnrollStudent = async (studentId: string) => {
        if (!selectedGroupForEnroll) return;
        try {
            await groupsService.enrollStudent(selectedGroupForEnroll.id, studentId);
            fetchData(); // Refresh to update student count
            // We keep the modal open to allow adding more students
        } catch (error) {
            alert('Студент уже в группе или произошла ошибка');
        }
    };

    const filteredStudents = students.filter(s =>
        s.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );

    if (loading && groups.length === 0) return <div className="loading-state">Загрузка данных...</div>;

    return (
        <div className="groups-page">
            <div className="page-header-actions">
                <div className="header-info">
                    <h1 className="page-title">Группы</h1>
                    <p className="page-subtitle">Управление учебными потоками ({groups.length})</p>
                </div>
                <button className="add-btn" onClick={() => openGroupModal()}>
                    <FaPlus size={18} />
                    <span>Создать группу</span>
                </button>
            </div>

            <div className="groups-grid-modern">
                {groups.map((group) => {
                    const course = courses.find(c => c.id === group.courseId);
                    const teacher = teachers.find(t => t.id === group.teacherId);

                    return (
                        <div key={group.id} className="group-card-modern glass-card">
                            <div className="group-card-header">
                                <div className="group-main-info">
                                    <h3 className="group-name">{group.name}</h3>
                                    <span className="course-badge" style={{ backgroundColor: course?.color + '20', color: course?.color }}>
                                        {course?.name}
                                    </span>
                                </div>
                                <div className="student-count-badge">
                                    <FaUsers />
                                    <span>{group.studentIds.length}</span>
                                </div>
                            </div>

                            <div className="group-card-details">
                                <div className="detail-row">
                                    <FaUserTie className="detail-icon teacher" />
                                    <div className="detail-content">
                                        <label>Преподаватель</label>
                                        <span>{teacher?.fullName}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <FaCalendarAlt className="detail-icon schedule" />
                                    <div className="detail-content">
                                        <label>Расписание</label>
                                        <span>{group.schedule}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="group-card-actions">
                                <button className="add-student-btn" onClick={() => { setSelectedGroupForEnroll(group); setEnrollModalOpen(true); }}>
                                    <FaUserPlus />
                                    <span>Добавить ученика</span>
                                </button>
                                <div className="secondary-actions">
                                    <button className="action-button view" onClick={() => navigate(`/groups/${group.id}`)} title="Список студентов">
                                        <FaUsers />
                                    </button>
                                    <button className="action-button edit" onClick={() => openGroupModal(group)} title="Изменить">
                                        <FaEdit />
                                    </button>
                                    <button className="action-button delete" onClick={() => handleDelete(group.id)} title="Удалить">
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal: Group Form */}
            <ModernModal
                isOpen={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
                title={selectedGroup ? 'Редактировать группу' : 'Новая группа'}
            >
                <form onSubmit={handleSaveGroup} className="modal-form">
                    <div className="form-group">
                        <label>Название группы</label>
                        <input
                            type="text"
                            placeholder="напр. Frontend-2024"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Курс</label>
                        <select
                            value={formData.courseId}
                            onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                            required
                        >
                            <option value="">Выберите курс</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Преподаватель</label>
                        <select
                            value={formData.teacherId}
                            onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                            required
                        >
                            <option value="">Выберите преподавателя</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Расписание</label>
                        <input
                            type="text"
                            placeholder="напр. Пн, Ср, Пт 19:00"
                            value={formData.schedule}
                            onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                            required
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setGroupModalOpen(false)}>Отмена</button>
                        <button type="submit" className="btn-primary">
                            <FaSave />
                            <span>Сохранить</span>
                        </button>
                    </div>
                </form>
            </ModernModal>

            {/* Modal: Enroll Student */}
            <ModernModal
                isOpen={enrollModalOpen}
                onClose={() => { setEnrollModalOpen(false); setStudentSearchTerm(''); }}
                title={`Добавить ученика в группу: ${selectedGroupForEnroll?.name}`}
                width="600px"
            >
                <div className="enroll-modal-content">
                    <div className="modal-search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Поиск студента по имени или email..."
                            value={studentSearchTerm}
                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="student-selection-list">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.slice(0, 10).map(student => {
                                const isEnrolled = selectedGroupForEnroll?.studentIds.includes(student.id);
                                return (
                                    <div key={student.id} className="student-selection-item">
                                        <div className="student-brief">
                                            <div className="avatar-mini">{student.fullName.charAt(0)}</div>
                                            <div className="name-email">
                                                <span className="student-name">{student.fullName}</span>
                                                <span className="student-email">{student.email}</span>
                                            </div>
                                        </div>
                                        {isEnrolled ? (
                                            <div className="enrolled-status">
                                                <FaCheck /> <span>В группе</span>
                                            </div>
                                        ) : (
                                            <button className="enroll-btn" onClick={() => handleEnrollStudent(student.id)}>
                                                Добавить
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-search">Студенты не найдены</div>
                        )}
                        {filteredStudents.length > 10 && (
                            <div className="more-results">Показано 10 из {filteredStudents.length} результатов...</div>
                        )}
                    </div>

                    <div className="modal-footer mt-4">
                        <button className="btn-secondary" onClick={() => setEnrollModalOpen(false)}>Закрыть</button>
                    </div>
                </div>
            </ModernModal>
        </div>
    );
};

export default Groups;
