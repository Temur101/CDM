import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaEdit,
    FaClock,
    FaTag,
    FaInfoCircle,
    FaLayerGroup,
    FaPalette
} from 'react-icons/fa';
import { coursesService } from '../services/courses.service';
import './CourseDetails.css';

const CourseDetails: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            coursesService.getById(id).then(data => {
                setCourse(data);
                setLoading(false);
            }).catch(() => {
                alert('Курс не найден');
                navigate('/courses');
            });
        }
    }, [id, navigate]);

    if (loading) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="courses-page">
            <div className="page-header-actions mb-6">
                <button className="icon-btn-back" onClick={() => navigate('/courses')}>
                    <FaArrowLeft size={18} />
                    <span>Назад к списку</span>
                </button>
            </div>

            <div className="details-container">
                {/* Hero Header */}
                <div className="details-hero glass" style={{ borderLeft: `8px solid ${course.color}` }}>
                    <div className="hero-content">
                        <div className="avatar-xl" style={{ backgroundColor: `${course.color}22`, color: course.color }}>
                            <FaLayerGroup size={48} />
                        </div>
                        <div className="hero-info">
                            <h1 className="hero-title">{course.name}</h1>
                            <div className="hero-meta">
                                <span className="id-badge">ID: {course.id.slice(0, 8)}</span>
                                <span className="status-badge-modern active">Активный курс</span>
                            </div>
                        </div>
                    </div>
                    <button className="edit-action-btn" onClick={() => navigate(`/courses/edit/${course.id}`)}>
                        <FaEdit size={18} />
                        <span>Редактировать</span>
                    </button>
                </div>

                <div className="details-grid">
                    {/* Course Info */}
                    <div className="details-card glass">
                        <div className="card-header">
                            <FaInfoCircle className="card-icon" style={{ color: '#f59e0b' }} />
                            <h3>Основная информация</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-group">
                                <label>Длительность</label>
                                <div className="info-value">
                                    <FaClock size={16} className="icon-sub" style={{ color: '#f59e0b' }} />
                                    <span>{course.duration}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <label>Стоимость</label>
                                <div className="info-value">
                                    <FaTag size={16} className="icon-sub" style={{ color: '#f59e0b' }} />
                                    <span className="price-text">{course.price.toLocaleString('ru-RU')} ₽</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Color Theme */}
                    <div className="details-card glass">
                        <div className="card-header">
                            <FaPalette className="card-icon" style={{ color: course.color }} />
                            <h3>Визуальное оформление</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-group">
                                <label>Цвет курса</label>
                                <div className="color-preview-container">
                                    <div className="color-box" style={{ backgroundColor: course.color }}></div>
                                    <span className="color-code">{course.color}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="details-card glass full-width">
                        <div className="card-header">
                            <FaInfoCircle className="card-icon" style={{ color: '#3b82f6' }} />
                            <h3>Описание курса</h3>
                        </div>
                        <div className="card-content">
                            <p className="description-text">
                                {course.description || 'Описание этого курса пока не добавлено. Здесь будут указаны основные цели, программа обучения и ожидаемые результаты.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
