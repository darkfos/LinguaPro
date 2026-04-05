import React, { useState, useEffect } from 'react';
import { 
  LogIn, LogOut, Users, MessageSquare, 
  CheckCircle, XCircle, Clock, Filter, Search,
  Mail, Phone, Calendar, Trash2, Edit,
  Star, Eye, RefreshCw,
  BarChart3, UserCheck, MailCheck, AlertCircle,
  ChevronLeft, ChevronRight,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import './AdminPanel.css';
import { api } from '../../utils/api';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({
    bookings: { total: 0, new: 0, contacted: 0, confirmed: 0, completed: 0, cancelled: 0 },
    reviews: { total: 0, avgRating: 0, pending: 0, approved: 0, rejected: 0 }
  });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState({ bookings: 1, reviews: 1 });
  const [totalPages, setTotalPages] = useState({ bookings: 1, reviews: 1 });

  // Проверка токена при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    console.log('При загрузке компонента:');
    console.log('Token из localStorage:', token);
    console.log('User из localStorage:', userData);
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      console.log('Пользователь авторизован, начинаем загрузку статистики...');
      fetchStatistics();
    } else {
      console.log('Пользователь не авторизован');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Авторизован, активная вкладка:', activeTab);
      if (activeTab === 'bookings') {
        fetchBookings();
      } else if (activeTab === 'reviews') {
        fetchReviews();
      } else if (activeTab === 'dashboard') {
        fetchStatistics();
      }
    }
  }, [isAuthenticated, activeTab, currentPage, bookingFilter, reviewFilter]);

  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Отправляем запрос на логин с данными:', loginData);
      const response = await fetch(`${api}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      console.log('Ответ от сервера:', data);

      if (data.success) {
        console.log('Логин успешен, сохраняем токен:', data.token);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        fetchStatistics();
        showNotification('Вход выполнен успешно');
      } else {
        setError(data.message || 'Неверные учетные данные');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setError('Ошибка подключения к серверу. Проверьте, запущен ли сервер на порту 5000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Выход из системы');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
    showNotification('Выход выполнен');
  };

  // Вспомогательная функция для отправки запросов с авторизацией
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    console.log('Токен для запроса:', token);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        console.error('Ошибка 401: Неавторизован. Токен:', token);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        showNotification('Сессия истекла. Пожалуйста, войдите снова', 'error');
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log('Загрузка статистики...');
      const data = await fetchWithAuth(`${api}/admin/statistics`);
      
      if (data && data.success) {
        console.log('Статистика получена:', data.data);
        setStatistics(data.data);
      } else if (data) {
        console.error('Ошибка при получении статистики:', data.message);
        showNotification(`Ошибка: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      showNotification('Ошибка загрузки статистики', 'error');
    }
  };

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.bookings,
        limit: 10,
        ...(bookingFilter !== 'all' && { status: bookingFilter })
      });

      const data = await fetchWithAuth(`${api}/admin/bookings?${params}`);
      
      if (data && data.success) {
        setBookings(data.data.bookings);
        setTotalPages(prev => ({ ...prev, bookings: data.data.pagination.pages }));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showNotification('Ошибка загрузки заявок', 'error');
    }
  };

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.reviews,
        limit: 10,
        ...(reviewFilter !== 'all' && { status: reviewFilter })
      });

      const data = await fetchWithAuth(`${api}/admin/reviews?${params}`);
      
      if (data && data.success) {
        console.log('Отзывы загружены:', data.data.reviews);
        setReviews(data.data.reviews);
        setTotalPages(prev => ({ ...prev, reviews: data.data.pagination.pages }));
      } else if (data) {
        console.error('Ошибка при получении отзывов:', data.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showNotification('Ошибка загрузки отзывов', 'error');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const data = await fetchWithAuth(`${api}/admin/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      
      if (data && data.success) {
        fetchBookings();
        fetchStatistics();
        showNotification('Статус заявки обновлен');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showNotification('Ошибка при обновлении статуса', 'error');
    }
  };

  const updateReviewStatus = async (id, status) => {
    try {
      const data = await fetchWithAuth(`${api}/admin/reviews/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      
      if (data && data.success) {
        fetchReviews();
        fetchStatistics();
        showNotification(`Отзыв ${status === 'approved' ? 'одобрен' : 'отклонен'}`);
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      showNotification('Ошибка при обновлении статуса', 'error');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      const data = await fetchWithAuth(`${api}/admin/bookings/${id}`, {
        method: 'DELETE'
      });
      
      if (data && data.success) {
        fetchBookings();
        fetchStatistics();
        showNotification('Заявка удалена');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      showNotification('Ошибка при удалении заявки', 'error');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      const data = await fetchWithAuth(`${api}/admin/reviews/${id}`, {
        method: 'DELETE'
      });
      
      if (data && data.success) {
        fetchReviews();
        fetchStatistics();
        showNotification('Отзыв удален');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showNotification('Ошибка при удалении отзыва', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'new': { text: 'Новая', class: 'status-new' },
      'contacted': { text: 'Связались', class: 'status-contacted' },
      'confirmed': { text: 'Подтверждена', class: 'status-confirmed' },
      'completed': { text: 'Завершена', class: 'status-completed' },
      'cancelled': { text: 'Отменена', class: 'status-cancelled' },
      'pending': { text: 'На модерации', class: 'status-pending' },
      'approved': { text: 'Одобрен', class: 'status-approved' },
      'rejected': { text: 'Отклонен', class: 'status-rejected' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: '' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < rating ? '#fbbf24' : 'none'}
        color={index < rating ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.name.toLowerCase().includes(searchLower) ||
      booking.email.toLowerCase().includes(searchLower) ||
      booking.phone.toLowerCase().includes(searchLower) ||
      booking.service.toLowerCase().includes(searchLower)
    );
  });

  const filteredReviews = reviews.filter(review => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      review.name.toLowerCase().includes(searchLower) ||
      (review.position && review.position.toLowerCase().includes(searchLower)) ||
      review.text.toLowerCase().includes(searchLower)
    );
  });

  const handlePageChange = (type, direction) => {
    setCurrentPage(prev => ({
      ...prev,
      [type]: direction === 'next' 
        ? Math.min(prev[type] + 1, totalPages[type])
        : Math.max(prev[type] - 1, 1)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo">
              <Users size={40} />
            </div>
            <h2>Панель управления LinguaPro</h2>
            <p>Войдите в систему для доступа к админ-панели</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                placeholder="Введите имя пользователя"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Введите пароль"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="error-message">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="spinning" />
                  <span>Вход...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Войти</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {successMessage && (
        <div className="notification success">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      
      {error && (
        <div className="notification error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <Users size={24} />
            <span>LinguaPro Admin</span>
          </div>
          <nav className="nav-tabs">
            <button 
              className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={18} />
              <span>Дашборд</span>
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <MailCheck size={18} />
              <span>Заявки</span>
              {statistics.bookings.new > 0 && (
                <span className="badge">{statistics.bookings.new}</span>
              )}
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare size={18} />
              <span>Отзывы</span>
              {statistics.reviews.pending > 0 && (
                <span className="badge">{statistics.reviews.pending}</span>
              )}
            </button>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">Администратор</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filters">
            {activeTab === 'bookings' && (
              <select 
                value={bookingFilter} 
                onChange={(e) => setBookingFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Все заявки</option>
                <option value="new">Новые</option>
                <option value="contacted">Связались</option>
                <option value="confirmed">Подтвержденные</option>
                <option value="completed">Завершенные</option>
                <option value="cancelled">Отмененные</option>
              </select>
            )}
            
            {activeTab === 'reviews' && (
              <select 
                value={reviewFilter} 
                onChange={(e) => setReviewFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Все отзывы</option>
                <option value="pending">На модерации ({statistics.reviews.pending})</option>
                <option value="approved">Одобренные ({statistics.reviews.approved})</option>
                <option value="rejected">Отклоненные ({statistics.reviews.rejected})</option>
              </select>
            )}
            
            <button className="refresh-button" onClick={() => {
              if (activeTab === 'dashboard') {
                fetchStatistics();
                showNotification('Статистика обновлена');
              } else if (activeTab === 'bookings') fetchBookings();
              else if (activeTab === 'reviews') fetchReviews();
            }}>
              <RefreshCw size={16} />
              Обновить
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <h2>Общая статистика</h2>
            <p className="last-updated">Обновлено: {new Date().toLocaleTimeString('ru-RU')}</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <Users size={24} />
                  <h3>Заявки</h3>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{statistics.bookings.total}</div>
                  <div className="stat-details">
                    <div className="stat-item">
                      <span className="status-badge status-new"></span>
                      <span>Новые: {statistics.bookings.new}</span>
                    </div>
                    <div className="stat-item">
                      <span className="status-badge status-contacted"></span>
                      <span>Связались: {statistics.bookings.contacted}</span>
                    </div>
                    <div className="stat-item">
                      <span className="status-badge status-confirmed"></span>
                      <span>Подтвержденные: {statistics.bookings.confirmed}</span>
                    </div>
                    <div className="stat-item">
                      <span className="status-badge status-completed"></span>
                      <span>Завершенные: {statistics.bookings.completed}</span>
                    </div>
                    <div className="stat-item">
                      <span className="status-badge status-cancelled"></span>
                      <span>Отмененные: {statistics.bookings.cancelled}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <MessageSquare size={24} />
                  <h3>Отзывы</h3>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{statistics.reviews.total}</div>
                  <div className="stat-details">
                    <div className="stat-item">
                      <span className="status-badge status-pending"></span>
                      <span>На модерации: {statistics.reviews.pending}</span>
                    </div>
                    <div className="stat-item">
                      <span className="status-badge status-approved"></span>
                      <span>Одобренные: {statistics.reviews.approved}</span>
                    </div>
                    <div className="stat-item">
                      <span className="status-badge status-rejected"></span>
                      <span>Отклоненные: {statistics.reviews.rejected}</span>
                    </div>
                    <div className="stat-item">
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      <span>Средняя оценка: {statistics.reviews.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>Управление заявками</h2>
            <p className="section-subtitle">Всего заявок: {bookings.length}</p>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Контакт</th>
                    <th>Услуга</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar small">
                            {booking.name.charAt(0)}
                          </div>
                          <div>
                            <div className="user-name">{booking.name}</div>
                            {booking.age_group && (
                              <div className="user-meta">{booking.age_group}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div><Mail size={12} /> {booking.email}</div>
                          <div><Phone size={12} /> {booking.phone}</div>
                        </div>
                      </td>
                      <td>
                        <div className="service-info">
                          <div className="service-name">{booking.service}</div>
                          {booking.level && (
                            <div className="service-level">{booking.level}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="status-cell">
                          {getStatusBadge(booking.status)}
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="new">Новая</option>
                            <option value="contacted">Связались</option>
                            <option value="confirmed">Подтверждена</option>
                            <option value="completed">Завершена</option>
                            <option value="cancelled">Отменена</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          {formatDate(booking.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn view"
                            onClick={() => alert(`Сообщение: ${booking.message || 'Нет сообщения'}`)}
                            title="Просмотреть сообщение"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => deleteBooking(booking.id)}
                            title="Удалить"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBookings.length === 0 && (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <p>Нет заявок для отображения</p>
                </div>
              )}
            </div>

            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange('bookings', 'prev')}
                disabled={currentPage.bookings === 1}
              >
                <ChevronLeft size={16} />
                Назад
              </button>
              
              <span className="page-info">
                Страница {currentPage.bookings} из {totalPages.bookings}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange('bookings', 'next')}
                disabled={currentPage.bookings === totalPages.bookings}
              >
                Вперед
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h2>Модерация отзывов</h2>
            <p className="section-subtitle">
              Отзывов на модерации: <span className="pending-count">{statistics.reviews.pending}</span>
            </p>
            
            <div className="reviews-grid">
              {filteredReviews.map(review => (
                <div key={review.id} className={`review-card ${review.status}`}>
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-info">
                        <div className="reviewer-name">{review.name}</div>
                        <div className="reviewer-position">{review.position || 'Клиент'}</div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span className="rating-number">{review.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="review-content">
                    <p>{review.text}</p>
                  </div>
                  
                  <div className="review-footer">
                    <div className="review-meta">
                      <div className="review-date">
                        {formatDate(review.created_at)}
                      </div>
                      <div className="review-id">
                        ID: #{review.id}
                      </div>
                      {getStatusBadge(review.status)}
                    </div>
                    
                    <div className="review-actions">
                      {review.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn approve"
                            onClick={() => updateReviewStatus(review.id, 'approved')}
                            title="Одобрить"
                          >
                            <ThumbsUp size={16} />
                            Одобрить
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => updateReviewStatus(review.id, 'rejected')}
                            title="Отклонить"
                          >
                            <ThumbsDown size={16} />
                            Отклонить
                          </button>
                        </>
                      )}
                      {review.status !== 'pending' && (
                        <div className="status-note">
                          {review.status === 'approved' ? '✓ Одобрено' : '✗ Отклонено'}
                        </div>
                      )}
                      <button 
                        className="action-btn delete"
                        onClick={() => deleteReview(review.id)}
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredReviews.length === 0 && (
              <div className="empty-state">
                <MessageSquare size={48} />
                <p>Нет отзывов для отображения</p>
                {reviewFilter === 'pending' && statistics.reviews.pending > 0 ? (
                  <p className="empty-note">Нажмите "Обновить", чтобы загрузить отзывы</p>
                ) : (
                  <p className="empty-note">Выберите другой фильтр или добавьте новые отзывы</p>
                )}
                <button 
                  className="refresh-btn"
                  onClick={fetchReviews}
                >
                  <RefreshCw size={16} />
                  Обновить список
                </button>
              </div>
            )}

            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange('reviews', 'prev')}
                disabled={currentPage.reviews === 1}
              >
                <ChevronLeft size={16} />
                Назад
              </button>
              
              <span className="page-info">
                Страница {currentPage.reviews} из {totalPages.reviews}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange('reviews', 'next')}
                disabled={currentPage.reviews === totalPages.reviews}
              >
                Вперед
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="admin-footer">
        <p>LinguaPro Admin Panel © {new Date().getFullYear()}</p>
        <p>Версия 1.0.0 | Пользователь: {user?.username} | Отзывов на модерации: {statistics.reviews.pending}</p>
      </footer>
    </div>
  );
};

export default AdminPanel;