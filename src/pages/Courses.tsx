import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClock, FaTag, FaChevronRight, FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa';
import { coursesService } from '../services/courses.service';
import ModernModal from '../components/ModernModal';
import './Courses.css';

const Courses: FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: '',
        color: '#6366f1'
    });

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await coursesService.getAll();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const openModal = (course: any = null) => {
        if (course) {
            setSelectedCourse(course);
            setFormData({
                name: course.name,
                description: course.description || '',
                price: course.price,
                duration: course.duration || '',
                color: course.color || '#6366f1'
            });
        } else {
            setSelectedCourse(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                duration: '',
                color: '#6366f1'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCourse) {
                await coursesService.update(selectedCourse.id, formData);
            } else {
                await coursesService.create(formData);
            }
            setIsModalOpen(false);
            fetchCourses();
        } catch (error) {
            alert('Ошибка при сохранении');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
            try {
                await coursesService.delete(id);
                fetchCourses();
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };

    if (loading && courses.length === 0) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="courses-page">
            <div className="page-header-actions">
                <div className="header-info">
                    <h1 className="page-title">Курсы</h1>
                    <p className="page-subtitle">Доступные программы обучения ({courses.length})</p>
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    <FaPlus size={18} />
                    <span>Создать курс</span>
                </button>
            </div>

            <div className="courses-grid">
                {courses.map((course) => (
                    <div key={course.id} className="course-card-modern glass-card">
                        <div className="course-accent-bar" style={{ backgroundColor: course.color }}></div>
                        <div className="course-card-body">
                            <div className="course-main-header">
                                <h3 className="course-name">{course.name}</h3>
                                <div className="badge-price">
                                    {course.price.toLocaleString('ru-RU')} ₽
                                </div>
                            </div>
                            <p className="course-description-text">{course.description}</p>

                            <div className="course-meta-tags">
                                <div className="meta-tag">
                                    <FaClock className="meta-icon" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="meta-tag">
                                    <FaTag className="meta-icon" />
                                    <span>Проф. курс</span>
                                </div>
                            </div>

                            <div className="course-card-footer">
                                <div className="action-row">
                                    <button className="action-link-btn" onClick={() => openModal(course)}>
                                        <FaEdit /> <span>Изменить</span>
                                    </button>
                                    <button className="icon-action-btn delete" onClick={() => handleDelete(course.id)}>
                                        <FaTrashAlt />
                                    </button>
                                </div>
                                <button className="outline-details-btn" onClick={() => navigate(`/courses/${course.id}`)}>
                                    <span>Детали</span>
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ModernModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCourse ? 'Редактировать курс' : 'Новый курс'}
            >
                <form onSubmit={handleSave} className="modal-form">
                    <div className="form-group">
                        <label>Название курса</label>
                        <input
                            type="text"
                            placeholder="Название"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            placeholder="Краткое описание курса..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Цена (₽)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Продолжительность</label>
                            <input
                                type="text"
                                placeholder="напр. 6 месяцев"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Цвет темы</label>
                        <div className="color-picker-wrapper" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                style={{ width: '60px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
                            />
                            <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{formData.color}</span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
                        <button type="submit" className="btn-primary">
                            <FaSave />
                            <span>Сохранить</span>
                        </button>
                    </div>
                </form>
            </ModernModal>
        </div>
    );
};

export default Courses;
