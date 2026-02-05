import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Camera, User } from 'lucide-react';
import { studentsService } from '../services/students.service';
import { storageService } from '../services/storage.service';
import './Students.css'; // Reusing styles

const StudentForm: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        status: 'pending' as 'active' | 'inactive' | 'pending',
        avatarUrl: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [noAvatar, setNoAvatar] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit && id) {
            studentsService.getById(id).then(data => {
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    status: data.status,
                    avatarUrl: data.avatarUrl || ''
                });
                setNoAvatar(!data.avatarUrl);
                setLoading(false);
            }).catch(() => {
                alert('Студент не найден');
                navigate('/students');
            });
        }
    }, [id, isEdit, navigate]);

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
                avatarUrl = await storageService.uploadAvatar(avatarFile, 'students-avatars');
            }

            const dataToSave = { ...formData, avatarUrl };

            if (isEdit && id) {
                await studentsService.update(id, dataToSave);
            } else {
                await studentsService.create(dataToSave);
            }
            navigate('/students');
        } catch (error: any) {
            console.error('Error saving student:', error);
            alert(`Ошибка при сохранении: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="p-8">Загрузка...</div>;

    return (
        <div className="students-page">
            <div className="page-header">
                <button className="icon-btn mr-4" onClick={() => navigate('/students')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="page-title">{isEdit ? 'Редактировать студента' : 'Добавить студента'}</h1>
            </div>

            <div className="glass p-6 max-w-2xl mt-6">
                <form onSubmit={handleSave} className="login-form" style={{ maxWidth: '100%' }}>
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
                        <label>Статус</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="active">Активен</option>
                            <option value="inactive">Неактивен</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Фотография студента</label>
                        <div className="avatar-upload-container">
                            <div className="avatar-preview-big glass">
                                {noAvatar ? (
                                    <div className="avatar-sm w-full h-full rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-2xl border border-indigo-500/20">
                                        {formData.fullName ? formData.fullName.charAt(0) : <User size={32} />}
                                    </div>
                                ) : avatarFile ? (
                                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" />
                                ) : formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Current" />
                                ) : (
                                    <div className="avatar-sm w-full h-full rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-2xl border border-indigo-500/20">
                                        {formData.fullName ? formData.fullName.charAt(0) : <User size={32} />}
                                    </div>
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

export default StudentForm;
