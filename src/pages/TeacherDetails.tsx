import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaEdit,
    FaEnvelope,
    FaPhone,
    FaChalkboardTeacher,
    FaStar,
    FaInfoCircle,
    FaBriefcase
} from 'react-icons/fa';
import { teachersService } from '../services/teachers.service';
import './TeacherDetails.css';

const TeacherDetails: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            teachersService.getById(id).then(data => {
                setTeacher(data);
                setLoading(false);
            }).catch(() => {
                alert('Преподаватель не найден');
                navigate('/teachers');
            });
        }
    }, [id, navigate]);

    if (loading) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="teachers-page">
            <div className="page-header-actions mb-6">
                <button className="icon-btn-back" onClick={() => navigate('/teachers')}>
                    <FaArrowLeft size={18} />
                    <span>Назад к списку</span>
                </button>
            </div>

            <div className="details-container">
                {/* Hero Header */}
                <div className="details-hero glass">
                    <div className="hero-content">
                        <div className="avatar-xl">
                            {teacher.avatarUrl ? (
                                <img src={teacher.avatarUrl} alt={teacher.fullName} className="teacher-avatar-img" />
                            ) : (
                                <FaChalkboardTeacher size={48} />
                            )}
                        </div>
                        <div className="hero-info">
                            <h1 className="hero-title">{teacher.fullName}</h1>
                            <div className="hero-meta">
                                <span className="id-badge">ID: {teacher.id.slice(0, 8)}</span>
                                <span className="status-badge-modern active">Преподаватель</span>
                            </div>
                        </div>
                    </div>
                    <button className="edit-action-btn" onClick={() => navigate(`/teachers/edit/${teacher.id}`)}>
                        <FaEdit size={18} />
                        <span>Редактировать</span>
                    </button>
                </div>

                <div className="details-grid">
                    {/* Contact Info */}
                    <div className="details-card glass">
                        <div className="card-header">
                            <FaEnvelope className="card-icon" style={{ color: '#3b82f6' }} />
                            <h3>Контакты</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-group">
                                <label>Email</label>
                                <div className="info-value">
                                    <FaEnvelope size={14} className="icon-sub" style={{ color: '#3b82f6' }} />
                                    <span>{teacher.email}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <label>Телефон</label>
                                <div className="info-value">
                                    <FaPhone size={14} className="icon-sub" style={{ color: '#3b82f6' }} />
                                    <span>{teacher.phone || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="details-card glass">
                        <div className="card-header">
                            <FaBriefcase className="card-icon" style={{ color: '#10b981' }} />
                            <h3>Профессиональные данные</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-group">
                                <label>Специализация</label>
                                <div className="info-value">
                                    <FaStar size={14} className="icon-sub" style={{ color: '#10b981' }} />
                                    <span className="highlight-text">{teacher.specialty}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <label>Опыт работы</label>
                                <div className="info-value">
                                    <FaInfoCircle size={14} className="icon-sub" style={{ color: '#10b981' }} />
                                    <span>{teacher.experience} лет</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description or Bio */}
                    <div className="details-card glass full-width">
                        <div className="card-header">
                            <FaInfoCircle className="card-icon" style={{ color: '#8b5cf6' }} />
                            <h3>О преподавателе</h3>
                        </div>
                        <div className="card-content">
                            <p className="no-data-text">Дополнительная информация о преподавателе пока не добавлена.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDetails;
