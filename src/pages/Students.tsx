import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrashAlt,
    FaEnvelope,
    FaPhone,
    FaEye,
    FaSave,
    FaCamera,
    FaUserGraduate
} from 'react-icons/fa';
import { studentsService } from '../services/students.service';
import { storageService } from '../services/storage.service';
import ModernModal from '../components/ModernModal';
import './Students.css';

const Students: FC = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const navigate = useNavigate();

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

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await studentsService.getAll();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const openModal = (student: any = null) => {
        setAvatarFile(null);
        if (student) {
            setSelectedStudent(student);
            setFormData({
                fullName: student.fullName,
                email: student.email,
                phone: student.phone || '',
                status: student.status,
                avatarUrl: student.avatarUrl || ''
            });
            setNoAvatar(!student.avatarUrl);
        } else {
            setSelectedStudent(null);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                status: 'pending',
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
                avatarUrl = await storageService.uploadAvatar(avatarFile, 'students-avatars');
            }

            const dataToSave = { ...formData, avatarUrl };

            if (selectedStudent) {
                await studentsService.update(selectedStudent.id, dataToSave);
            } else {
                await studentsService.create(dataToSave);
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (error: any) {
            console.error('Error saving student:', error);
            alert(`Ошибка при сохранении: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
            try {
                await studentsService.delete(id);
                fetchStudents();
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading && students.length === 0) return <div className="p-8">Загрузка...</div>;

    return (
        <div className="students-page">
            <div className="page-header-actions">
                <div className="header-info">
                    <h1 className="page-title">Студенты</h1>
                    <p className="page-subtitle">Всего студентов: {filteredStudents.length}</p>
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    <FaPlus size={18} />
                    <span>Добавить студента</span>
                </button>
            </div>

            <div className="glass p-4 mb-6 flex flex-wrap gap-4 items-center rounded-2xl">
                <div className="search-box flex-1 min-w-[200px] flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <FaSearch size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Поиск студентов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white flex-1"
                    />
                </div>
                <div className="filter-box flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <FaFilter size={16} className="text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent border-none outline-none text-white cursor-pointer"
                    >
                        <option value="all">Все статусы</option>
                        <option value="active">Активные</option>
                        <option value="inactive">Неактивные</option>
                        <option value="pending">Ожидающие</option>
                    </select>
                </div>
            </div>

            <div className="table-container glass p-4 rounded-2xl">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Студент</th>
                            <th>Контакты</th>
                            <th>Регистрация</th>
                            <th>Статус</th>
                            <th className="text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>
                                    <div className="student-info-cell flex items-center gap-3">
                                        <div className="avatar-sm">
                                            {student.avatarUrl ? (
                                                <img src={student.avatarUrl} alt={student.fullName} />
                                            ) : (
                                                student.fullName.charAt(0)
                                            )}
                                        </div>
                                        <span className="student-name">{student.fullName}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info flex flex-col gap-1">
                                        <div className="contact-item flex items-center gap-2 text-sm text-slate-400">
                                            <FaEnvelope size={12} className="text-pink-500/70" /> {student.email}
                                        </div>
                                        {student.phone && (
                                            <div className="contact-item flex items-center gap-2 text-sm text-slate-400">
                                                <FaPhone size={12} className="text-emerald-500/70" /> {student.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="text-sm text-slate-400">{new Date(student.registrationDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge-modern ${student.status}`}>
                                        {student.status === 'active' ? 'Активен' : student.status === 'inactive' ? 'Неактивен' : 'Ожидание'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="row-actions flex justify-end gap-2">
                                        <button className="icon-btn edit" onClick={() => openModal(student)} title="Редактировать"><FaEdit size={14} /></button>
                                        <button className="icon-btn view" onClick={() => navigate(`/students/${student.id}`)} title="Просмотреть"><FaEye size={14} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(student.id)} title="Удалить"><FaTrashAlt size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModernModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedStudent ? 'Редактировать студента' : 'Добавить студента'}
            >
                <form onSubmit={handleSave} className="modal-form">
                    <div className="form-group">
                        <label>ФИО</label>
                        <input
                            type="text"
                            placeholder="Полное имя"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="example@edu.com"
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
                    <div className="form-group">
                        <label>Статус</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="active">Активен</option>
                            <option value="inactive">Неактивен</option>
                            <option value="pending">Ожидание</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Фотография студента</label>
                        <div className="avatar-upload-container">
                            <div className="avatar-preview-big glass">
                                {noAvatar ? (
                                    <div className="avatar-sm w-full h-full rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-2xl border border-indigo-500/20">
                                        {formData.fullName ? formData.fullName.charAt(0) : <FaUserGraduate size={32} />}
                                    </div>
                                ) : avatarFile ? (
                                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" />
                                ) : formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Current" />
                                ) : (
                                    <div className="avatar-sm w-full h-full rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-2xl border border-indigo-500/20">
                                        {formData.fullName ? formData.fullName.charAt(0) : <FaUserGraduate size={32} />}
                                    </div>
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

export default Students;
