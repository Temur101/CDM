import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaEdit,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaGraduationCap,
    FaUserGraduate,
    FaInfoCircle
} from 'react-icons/fa';
import { studentsService } from '../services/students.service';
import './StudentDetails.css';

const StudentDetails: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            studentsService.getById(id).then(data => {
                setStudent(data);
                setLoading(false);
            }).catch(() => {
                alert('Студент не найден');
                navigate('/students');
            });
        }
    }, [id, navigate]);

    if (loading) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="students-page">
            <div className="page-header-actions mb-6">
                <button className="icon-btn-back" onClick={() => navigate('/students')}>
                    <FaArrowLeft size={18} />
                    <span>Назад к списку</span>
                </button>
            </div>

            <div className="details-container">
                {/* Hero Header */}
                <div className="details-hero glass">
                    <div className="hero-content">
                        <div className="avatar-xl overflow-hidden flex items-center justify-center bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                            {student.avatarUrl ? (
                                <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                            ) : (
                                student.fullName.charAt(0)
                            )}
                        </div>
                        <div className="hero-info">
                            <h1 className="hero-title">{student.fullName}</h1>
                            <div className="hero-meta">
                                <span className="id-badge">ID: {student.id.slice(0, 8)}</span>
                                <span className={`status-badge-modern ${student.status}`}>
                                    {student.status === 'active' ? 'Активен' : student.status === 'inactive' ? 'Неактивен' : 'Ожидание'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="edit-action-btn" onClick={() => navigate(`/students/edit/${student.id}`)}>
                        <FaEdit size={18} />
                        <span>Редактировать</span>
                    </button>
                </div>

                <div className="details-grid">
                    {/* Contact Information */}
                    <div className="details-card glass">
                        <div className="card-header">
                            <FaEnvelope className="card-icon" style={{ color: '#ec4899' }} />
                            <h3>Контактная информация</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-group">
                                <label>Email</label>
                                <div className="info-value">
                                    <FaEnvelope size={14} className="icon-sub" style={{ color: '#ec4899' }} />
                                    <span>{student.email}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <label>Телефон</label>
                                <div className="info-value">
                                    <FaPhone size={14} className="icon-sub" style={{ color: '#ec4899' }} />
                                    <span>{student.phone || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="details-card glass">
                        <div className="card-header">
                            <FaGraduationCap className="card-icon" style={{ color: '#6366f1' }} />
                            <h3>Обучение</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-group">
                                <label>Группа</label>
                                <div className="info-value">
                                    <FaUserGraduate size={14} className="icon-sub" style={{ color: '#6366f1' }} />
                                    <span className="highlight-text">{student.group || 'Не прикреплен'}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <label>Дата регистрации</label>
                                <div className="info-value">
                                    <FaCalendarAlt size={14} className="icon-sub" style={{ color: '#6366f1' }} />
                                    <span>{new Date(student.registrationDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="details-card glass full-width">
                        <div className="card-header">
                            <FaInfoCircle className="card-icon" style={{ color: '#10b981' }} />
                            <h3>Дополнительные сведения</h3>
                        </div>
                        <div className="card-content">
                            <p className="no-data-text">Дополнительных примечаний пока нет.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
