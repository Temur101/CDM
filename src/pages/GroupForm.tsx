import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { groupsService } from '../services/groups.service';
import { coursesService } from '../services/courses.service';
import { teachersService } from '../services/teachers.service';
import './Groups.css';

const GroupForm: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        courseId: '',
        teacherId: '',
        schedule: ''
    });
    const [courses, setCourses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [c, t] = await Promise.all([
                    coursesService.getAll(),
                    teachersService.getAll()
                ]);
                setCourses(c);
                setTeachers(t);

                if (isEdit && id) {
                    const data = await groupsService.getById(id);
                    setFormData({
                        name: data.name,
                        courseId: data.courseId,
                        teacherId: data.teacherId,
                        schedule: data.schedule
                    });
                }
            } catch (error) {
                alert('Ошибка при загрузке данных');
                navigate('/groups');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) {
                await groupsService.update(id, formData);
            } else {
                await groupsService.create(formData);
            }
            navigate('/groups');
        } catch (error) {
            alert('Ошибка при сохранении');
        }
    };

    if (loading) return <div className="p-8">Загрузка...</div>;

    return (
        <div className="groups-page">
            <div className="page-header">
                <button className="icon-btn mr-4" onClick={() => navigate('/groups')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="page-title">{isEdit ? 'Редактировать группу' : 'Создать группу'}</h1>
            </div>

            <div className="glass p-6 max-w-2xl mt-6">
                <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '100%' }}>
                    <div className="form-group">
                        <label>Название группы</label>
                        <input
                            type="text"
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
                            value={formData.schedule}
                            onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                            placeholder="напр. Пн, Ср, Пт 19:00"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn mt-6">
                        <Save size={20} />
                        <span>Сохранить</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupForm;
