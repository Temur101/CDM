import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { coursesService } from '../services/courses.service';
import './Courses.css';

const CourseForm: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: '',
        color: '#6366f1'
    });
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit && id) {
            coursesService.getById(id).then(data => {
                setFormData({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                    color: data.color || '#6366f1'
                });
                setLoading(false);
            }).catch(() => {
                alert('Курс не найден');
                navigate('/courses');
            });
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) {
                await coursesService.update(id, formData);
            } else {
                await coursesService.create(formData);
            }
            navigate('/courses');
        } catch (error) {
            alert('Ошибка при сохранении');
        }
    };

    if (loading) return <div className="p-8">Загрузка...</div>;

    return (
        <div className="courses-page">
            <div className="page-header">
                <button className="icon-btn mr-4" onClick={() => navigate('/courses')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="page-title">{isEdit ? 'Редактировать курс' : 'Создать курс'}</h1>
            </div>

            <div className="glass p-6 max-w-2xl mt-6">
                <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '100%' }}>
                    <div className="form-group">
                        <label>Название курса</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            rows={4}
                        />
                    </div>
                    <div className="form-group">
                        <label>Цена (₽)</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Продолжительность</label>
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="напр. 6 месяцев"
                        />
                    </div>
                    <div className="form-group">
                        <label>Цвет темы</label>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                            style={{ height: '40px' }}
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

export default CourseForm;
