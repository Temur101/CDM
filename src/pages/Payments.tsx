import { useState, useEffect, type FC, useMemo } from 'react';
import {
    FaDownload,
    FaSearch,
    FaTrashAlt,
    FaSave,
    FaUsers,
    FaMoneyBillWave
} from 'react-icons/fa';
import { paymentsService } from '../services/payments.service';
import { studentsService } from '../services/students.service';
import ModernModal from '../components/ModernModal';
import './Payments.css';

const Payments: FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);



    // Form state
    const [newPayment, setNewPayment] = useState({
        studentId: '',
        studentName: '',
        amount: '',
        method: 'card',
        status: 'paid'
    });

    const [memberSearchTerm, setMemberSearchTerm] = useState('');

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await paymentsService.getAll();
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await studentsService.getAll();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchStudents();
    }, []);





    const handleQuickPay = (student: any) => {
        setNewPayment({
            studentId: student.id,
            studentName: student.fullName,
            amount: '',
            method: 'card',
            status: 'paid'
        });
        setIsModalOpen(true);
    };

    const filteredMembers = useMemo(() => {
        return students.filter(s =>
            s.fullName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
        );
    }, [students, memberSearchTerm]);

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPayment.studentId || !newPayment.amount) {
            alert('Пожалуйста, выберите студента из списка и укажите сумму');
            return;
        }

        try {
            await paymentsService.create({
                studentId: newPayment.studentId,
                amount: Number(newPayment.amount),
                method: newPayment.method as any,
                status: newPayment.status as any
            });
            setIsModalOpen(false);
            setNewPayment({ studentId: '', studentName: '', amount: '', method: 'card', status: 'paid' });
            fetchPayments();
        } catch (error) {
            alert('Ошибка при добавлении платежа: ' + (error as Error).message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Удалить запись о платеже?')) {
            try {
                await paymentsService.delete(id);
                fetchPayments();
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };



    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Оплачено';
            case 'pending': return 'Ожидание';
            case 'failed': return 'Ошибка';
            default: return status;
        }
    };

    if (loading && payments.length === 0) return <div className="loading-state">Загрузка платежей...</div>;

    return (
        <div className="payments-page">
            <div className="page-header-actions">
                <div className="header-info">
                    <h1 className="page-title">Платежи</h1>
                    <p className="page-subtitle">История транзакций и статус оплат ({payments.length})</p>
                </div>
            </div>

            <div className="payments-grid">
                {/* Left Column: History */}
                <div className="history-card glass-card">
                    <div className="card-header-modern">
                        <h2>История транзакций</h2>
                        <button className="export-btn glass-btn">
                            <FaDownload size={14} />
                            <span>CSV</span>
                        </button>
                    </div>
                    <div className="table-container-mini">
                        <table className="data-table-mini">
                            <thead>
                                <tr>
                                    <th>Студент</th>
                                    <th>Дата</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th className="text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>
                                            <div className="student-info-cell">
                                                <div className="avatar-xs">{payment.studentName.charAt(0)}</div>
                                                <span>{payment.studentName}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                        <td><span className="amount-badge">{payment.amount.toLocaleString()}₽</span></td>
                                        <td>
                                            <div className={`status-pill-mini ${payment.status}`}>
                                                {getStatusLabel(payment.status)}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="icon-action-btn delete" onClick={() => handleDelete(payment.id)}>
                                                <FaTrashAlt size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Students List */}
                <div className="students-card glass-card">
                    <div className="card-header-modern">
                        <h2>Студенты</h2>
                        <div className="student-count-badge">
                            <FaUsers size={14} />
                            <span>{students.length}</span>
                        </div>
                    </div>

                    <div className="card-search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Поиск ученика..."
                            value={memberSearchTerm}
                            onChange={(e) => setMemberSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="students-quick-list">
                        {filteredMembers.map(student => (
                            <div key={student.id} className="student-quick-item">
                                <div className="student-info-mini">
                                    <div className="avatar-xs">{student.fullName.charAt(0)}</div>
                                    <div className="student-name-mini">{student.fullName}</div>
                                </div>
                                <button className="pay-btn-mini" onClick={() => handleQuickPay(student)}>
                                    <FaMoneyBillWave size={12} />
                                    <span>Оплатить</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ModernModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Новый платеж"
                width="500px"
            >
                <form onSubmit={handleAddPayment} className="modal-form">
                    <div className="form-group selected-student-info">
                        <label>Студент</label>
                        <div className="selected-student-display">
                            <div className="avatar-xs">{newPayment.studentName.charAt(0)}</div>
                            <span className="student-name-text">{newPayment.studentName}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Сумма (₽)</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={newPayment.amount}
                            onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Метод</label>
                            <select
                                value={newPayment.method}
                                onChange={e => setNewPayment({ ...newPayment, method: e.target.value })}
                            >
                                <option value="card">Карта</option>
                                <option value="transfer">Перевод</option>
                            </select>
                        </div>
                        <div className="form-group flex-1">
                            <label>Статус</label>
                            <select
                                value={newPayment.status}
                                onChange={e => setNewPayment({ ...newPayment, status: e.target.value })}
                            >
                                <option value="paid">Оплачено</option>
                                <option value="pending">Ожидание</option>
                                <option value="failed">Ошибка</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
                        <button type="submit" className="btn-primary">
                            <FaSave />
                            <span>Добавить</span>
                        </button>
                    </div>
                </form>
            </ModernModal>
        </div>
    );
};

export default Payments;
