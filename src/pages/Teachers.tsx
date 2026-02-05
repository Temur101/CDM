import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaEdit, FaTrashAlt, FaPlus, FaChalkboardTeacher, FaSave, FaCamera } from 'react-icons/fa';
import { teachersService } from '../services/teachers.service';
import { storageService } from '../services/storage.service';
import ModernModal from '../components/ModernModal';
import './Teachers.css';

const Teachers: FC = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        specialty: '',
        experience: '',
        avatarUrl: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [noAvatar, setNoAvatar] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const data = await teachersService.getAll();
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const openModal = (teacher: any = null) => {
        setAvatarFile(null);
        if (teacher) {
            setSelectedTeacher(teacher);
            setFormData({
                fullName: teacher.fullName,
                email: teacher.email,
                phone: teacher.phone || '',
                specialty: teacher.specialty || '',
                experience: teacher.experience || '',
                avatarUrl: teacher.avatarUrl || ''
            });
            setNoAvatar(!teacher.avatarUrl);
        } else {
            setSelectedTeacher(null);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                specialty: '',
                experience: '',
                avatarUrl: ''
            });
            setNoAvatar(false);
        }
        setIsModalOpen(true);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setNoAvatar(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let avatarUrl = formData.avatarUrl;

            if (noAvatar) {
                avatarUrl = '';
            } else if (avatarFile) {
                avatarUrl = await storageService.uploadAvatar(avatarFile);
            }

            const dataToSave = { ...formData, avatarUrl };

            if (selectedTeacher) {
                await teachersService.update(selectedTeacher.id, dataToSave);
            } else {
                await teachersService.create(dataToSave);
            }
            setIsModalOpen(false);
            fetchTeachers();
        } catch (error) {
            console.error('Error saving teacher:', error);
            alert('Ошибка при сохранении');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
            try {
                await teachersService.delete(id);
                fetchTeachers();
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };

    if (loading && teachers.length === 0) return <div className="loading-state">Загрузка...</div>;

    return (
        <div className="teachers-page">
            <div className="page-header-actions">
                <div className="header-info">
                    <h1 className="page-title">Преподаватели</h1>
                    <p className="page-subtitle">Наш преподавательский состав ({teachers.length})</p>
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    <FaPlus size={18} />
                    <span>Добавить преподавателя</span>
                </button>
            </div>

            <div className="teachers-grid">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="teacher-card glass-card">
                        <div
                            className="teacher-info-section clickable"
                            onClick={() => navigate(`/teachers/${teacher.id}`)}
                        >
                            <div className="avatar-wrapper">
                                <div className="avatar-main">
                                    {teacher.avatarUrl ? (
                                        <img src={teacher.avatarUrl} alt={teacher.fullName} className="teacher-avatar-img" />
                                    ) : (
                                        <FaChalkboardTeacher size={32} />
                                    )}
                                </div>
                                <div className="experience-indicator" title="Опыт работы">
                                    {teacher.experience}
                                </div>
                            </div>
                            <div className="teacher-main-details">
                                <h3 className="teacher-name">{teacher.fullName}</h3>
                                <div className="teacher-specialty-tag">{teacher.specialty}</div>
                            </div>
                        </div>

                        <div className="teacher-contact-list">
                            <div className="contact-link">
                                <FaEnvelope className="contact-icon email" />
                                <span>{teacher.email}</span>
                            </div>
                            <div className="contact-link">
                                <FaPhone className="contact-icon phone" />
                                <span>{teacher.phone || '—'}</span>
                            </div>
                        </div>

                        <div className="teacher-card-footer">
                            <div className="card-actions">
                                <button className="action-btn-modern edit" onClick={(e) => { e.stopPropagation(); openModal(teacher); }}>
                                    <FaEdit />
                                    <span>Изменить</span>
                                </button>
                                <button className="action-btn-modern delete" onClick={(e) => { e.stopPropagation(); handleDelete(teacher.id); }}>
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ModernModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTeacher ? 'Редактировать преподавателя' : 'Новый преподаватель'}
            >
                <form onSubmit={handleSave} className="modal-form">
                    <div className="form-group">
                        <label>ФИО</label>
                        <input
                            type="text"
                            placeholder="Введите ФИО"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="text"
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Специализация</label>
                            <input
                                type="text"
                                placeholder="Например: Математика"
                                value={formData.specialty}
                                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Опыт (лет)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Фотография преподавателя</label>
                        <div className="avatar-upload-container">
                            <div className="avatar-preview-big glass">
                                {noAvatar ? (
                                    <FaChalkboardTeacher size={48} className="placeholder-icon" />
                                ) : avatarFile ? (
                                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" />
                                ) : formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Current" />
                                ) : (
                                    <FaChalkboardTeacher size={48} className="placeholder-icon" />
                                )}
                            </div>
                            <div className="upload-controls">
                                <label className="upload-btn-modern">
                                    <FaCamera />
                                    <span>Выбрать фото</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                        disabled={noAvatar}
                                    />
                                </label>
                                <label className="no-photo-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={noAvatar}
                                        onChange={(e) => setNoAvatar(e.target.checked)}
                                    />
                                    <span>Не использовать фото</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Отмена</button>
                        <button type="submit" className="btn-primary" disabled={isUploading}>
                            {isUploading ? <div className="loader-small"></div> : <FaSave />}
                            <span>{isUploading ? 'Загрузка...' : 'Сохранить'}</span>
                        </button>
                    </div>
                </form>
            </ModernModal>
        </div>
    );
};

export default Teachers;
