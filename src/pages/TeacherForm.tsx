import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import { teachersService } from '../services/teachers.service';
import { storageService } from '../services/storage.service';
import { FaChalkboardTeacher } from 'react-icons/fa';
import './Teachers.css';

const TeacherForm: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

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
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit && id) {
            teachersService.getById(id).then(data => {
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    specialty: data.specialty,
                    experience: data.experience,
                    avatarUrl: data.avatarUrl || ''
                });
                setNoAvatar(!data.avatarUrl);
                setLoading(false);
            }).catch(() => {
                alert('Преподаватель не найден');
                navigate('/teachers');
            });
        }
    }, [id, isEdit, navigate]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setNoAvatar(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

            if (isEdit && id) {
                await teachersService.update(id, dataToSave);
            } else {
                await teachersService.create(dataToSave);
            }
            navigate('/teachers');
        } catch (error) {
            console.error('Error saving teacher:', error);
            alert('Ошибка при сохранении');
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="p-8">Загрузка...</div>;

    return (
        <div className="teachers-page">
            <div className="page-header">
                <button className="icon-btn mr-4" onClick={() => navigate('/teachers')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="page-title">{isEdit ? 'Редактировать преподавателя' : 'Добавить преподавателя'}</h1>
            </div>

            <div className="glass p-6 max-w-2xl mt-6">
                <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '100%' }}>
                    <div className="form-group">
                        <label>ФИО</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Специализация</label>
                        <input
                            type="text"
                            value={formData.specialty}
                            onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Опыт работы</label>
                        <input
                            type="text"
                            value={formData.experience}
                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        />
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
                                    <Camera size={20} />
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

                    <button type="submit" className="login-btn mt-6" disabled={isUploading}>
                        {isUploading ? <div className="loader-small"></div> : <Save size={20} />}
                        <span>{isUploading ? 'Загрузка...' : 'Сохранить'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherForm;
