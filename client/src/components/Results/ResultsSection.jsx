import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Target, Users, Clock, 
  ArrowRight, Star, Send, CheckCircle, 
  User, Mail, MessageSquare, RefreshCw,
  Shuffle, Award, GraduationCap, ShieldCheck
} from 'lucide-react';
import Modal from '../Modal/Modal'; 
import './ResultsSection.css';

import { api } from '../../utils/api';

const ResultsSection = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [displayedTestimonials, setDisplayedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const results = [
    {
      icon: <GraduationCap />,
      value: '85+',
      label: 'Средний балл',
      description: 'На ОГЭ/ЕГЭ у учеников'
    },
    {
      icon: <Target />,
      value: '94%',
      label: 'Достигают цели',
      description: 'Учеников завершают курс успешно'
    },
    {
      icon: <Users />,
      value: '200+',
      label: 'Учеников',
      description: 'Доверили нам свое обучение'
    },
    {
      icon: <Clock />,
      value: '4 мес.',
      label: 'Заметный прогресс',
      description: 'Среднее время для видимых результатов'
    }
  ];

  const getRandomTestimonials = (testimonials, count = 3) => {
    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      return [];
    }
    
    if (testimonials.length <= count) {
      return [...testimonials];
    }
    
    const shuffled = [...testimonials];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (Array.isArray(allTestimonials) && allTestimonials.length > 0) {
      const randomTestimonials = getRandomTestimonials(allTestimonials, 3);
      setDisplayedTestimonials(randomTestimonials);
    } else {
      setDisplayedTestimonials([]);
    }
  }, [allTestimonials, refreshKey]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Загрузка отзывов...');
      
      const response = await fetch(`${api}/reviews`);
      
      if (!response.ok) {
        throw new Error(`HTTP ошибка! Статус: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Данные с сервера:', data);
      
      if (data.success && Array.isArray(data.data)) {
        const approvedTestimonials = data.data.filter(
          testimonial => testimonial && testimonial.status === 'approved'
        );
        
        console.log('Одобренные отзывы:', approvedTestimonials);
        
        if (approvedTestimonials.length > 0) {
          setAllTestimonials(approvedTestimonials);
        } else {
          console.warn('Нет одобренных отзывов');
          setAllTestimonials([]);
        }
      } else {
        console.error('Неверный формат данных:', data);
        setError('Не удалось загрузить отзывы: некорректный ответ сервера');
        setAllTestimonials([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
      setError('Ошибка подключения к серверу. Проверьте, запущен ли сервер на порту 5000');
      setAllTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleStarHover = (starIndex) => {
    setHoverRating(starIndex + 1);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (e) => {
    setPrivacyAgreement(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.text.trim() || rating === 0) {
      alert('Пожалуйста, заполните все обязательные поля и поставьте оценку');
      return;
    }
    
    if (!privacyAgreement) {
      alert('Для отправки отзыва необходимо дать согласие на обработку персональных данных');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${api}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          position: formData.position.trim(),
          text: formData.text.trim(),
          rating: rating
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', position: '', text: '' });
        setRating(0);
        setPrivacyAgreement(false);
        
        setTimeout(() => {
          fetchTestimonials();
          setRefreshKey(prev => prev + 1);
        }, 1500);
      } else {
        alert(data.message || 'Ошибка при отправке отзыва');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Ошибка подключения к серверу. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReview = () => {
    setIsSubmitted(false);
    setPrivacyAgreement(false);
  };

  const handleShuffleTestimonials = () => {
    if (allTestimonials.length > 0) {
      setRefreshKey(prev => prev + 1);
    }
  };

  const renderStars = (ratingValue) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`star-rs ${ratingValue >= starValue ? 'active-rs' : ''}`}
          fill={ratingValue >= starValue ? 'currentColor' : 'none'}
          size={14}
        />
      );
    });
  };

  const renderFormStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const displayRating = hoverRating || rating;
      
      return (
        <Star
          key={index}
          className={`star-rs ${displayRating >= starValue ? 'active-rs' : ''}`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleStarLeave}
          fill={displayRating >= starValue ? 'currentColor' : 'none'}
        />
      );
    });
  };

  return (
    <>
      <section id="results" className="results-section-rs">
        <div className="results-background-rs">
          <div className="watercolor-blob-rs watercolor-1-rs"></div>
          <div className="watercolor-blob-rs watercolor-2-rs"></div>
          <div className="watercolor-blob-rs watercolor-3-rs"></div>
          <div className="texture-overlay-rs"></div>
        </div>
        
        <div className="results-container-rs">
          <div className="results-header-rs">
            <h2 className="section-title-rs">Наши результаты</h2>
            <p className="section-subtitle-rs">
              Цифры и отзывы, которые показывают эффективность подхода и радуют учеников
            </p>
          </div>

          <div className="results-stats-rs">
            {results.map((result, index) => (
              <div key={index} className="result-card-rs">
                <div className="result-icon-wrapper-rs">
                  <div className="result-icon-rs">
                    {result.icon}
                  </div>
                </div>
                <div className="result-content-rs">
                  <div className="result-value-rs">{result.value}</div>
                  <div className="result-label-rs">{result.label}</div>
                  <div className="result-description-rs">{result.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-section-rs">
            <div className="testimonials-header-rs">
              <h3 className="testimonials-title-rs">Отзывы учеников</h3>
              <div className="testimonials-controls-rs">
                <button 
                  onClick={handleShuffleTestimonials} 
                  className="shuffle-button-rs"
                  disabled={loading || allTestimonials.length <= 3}
                  title="Показать другие отзывы"
                >
                  <Shuffle size={16} />
                </button>
                <button 
                  onClick={fetchTestimonials} 
                  className="refresh-button-rs"
                  disabled={loading}
                  title="Обновить отзывы"
                >
                  <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-rs">
                <RefreshCw size={24} className="spinning" />
                <p>Загрузка отзывов...</p>
              </div>
            ) : error ? (
              <div className="error-rs">
                <p>{error}</p>
                <button 
                  onClick={fetchTestimonials} 
                  className="retry-button-rs"
                >
                  Попробовать снова
                </button>
              </div>
            ) : displayedTestimonials.length === 0 ? (
              <div className="no-testimonials-rs">
                <MessageSquare size={48} />
                <p>Пока нет отзывов. Будьте первым!</p>
                <p className="hint-rs">
                  Оставьте свой отзыв в форме ниже - он появится после модерации.
                </p>
              </div>
            ) : (
              <>
                <div className="testimonials-info-rs">
                  <p className="testimonials-count-rs">
                    Показано: <strong>{displayedTestimonials.length}</strong> из <strong>{allTestimonials.length}</strong> отзывов
                  </p>
                  <p className="testimonials-hint-rs">
                    Нажмите <Shuffle size={12} /> чтобы увидеть другие отзывы
                  </p>
                </div>
                <div className="testimonials-grid-rs">
                  {displayedTestimonials.map((testimonial) => (
                    <div key={`${testimonial.id}-${refreshKey}`} className="testimonial-card-rs">
                      <div className="testimonial-header-rs">
                        <div className="testimonial-avatar-rs">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="testimonial-author-rs">
                          <div className="author-name-rs">{testimonial.name}</div>
                        </div>
                        <div className="testimonial-rating-rs">
                          {renderStars(testimonial.rating)}
                          <span className="rating-number-rs">{testimonial.rating}/5</span>
                        </div>
                      </div>
                      <p className="testimonial-text-rs">{testimonial.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="add-testimonial-section-rs">
            <h3 className="add-testimonial-title-rs">Оставьте свой отзыв</h3>
            
            {isSubmitted ? (
              <div className="success-message-rs">
                <CheckCircle className="success-icon-rs" />
                <h4 className="success-title-rs">Спасибо за ваш отзыв!</h4>
                <p className="success-text-rs">
                  Ваш отзыв успешно отправлен. После модерации он появится на сайте.
                </p>
                <p className="success-note-rs">
                  <small>
                    Все отзывы проходят модерацию. Это обычно занимает 1-2 рабочих дня.
                  </small>
                </p>
                <button 
                  className="success-button-rs"
                  onClick={handleNewReview}
                >
                  <MessageSquare size={18} />
                  Оставить еще один отзыв
                </button>
              </div>
            ) : (
              <form className="testimonial-form-rs" onSubmit={handleSubmit}>
                <div className="form-row-rs">
                  <div className="form-group-rs">
                    <label className="form-label-rs">
                      <User size={16} style={{ marginRight: '8px' }} />
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-input-rs"
                      placeholder="Как к вам обращаться?"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group-rs">
                    <label className="form-label-rs">
                      <Mail size={16} style={{ marginRight: '8px' }} />
                      Ваша должность / статус
                    </label>
                    <input
                      type="text"
                      name="position"
                      className="form-input-rs"
                      placeholder="Студент, специалист, путешественник..."
                      value={formData.position}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group-rs">
                  <label className="form-label-rs">
                    <MessageSquare size={16} style={{ marginRight: '8px' }} />
                    Ваш отзыв *
                  </label>
                  <textarea
                    name="text"
                    className="form-textarea-rs"
                    placeholder="Поделитесь своим опытом обучения..."
                    value={formData.text}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-rating-rs">
                  <label className="rating-label-rs">Ваша оценка *</label>
                  <div className="rating-stars-rs">
                    {renderFormStars()}
                    <span className="rating-value-rs">
                      {rating > 0 ? `${rating}/5` : 'Поставьте оценку'}
                    </span>
                  </div>
                </div>

                <div className="form-privacy-rs">
                  <label className="privacy-checkbox-rs">
                    <input
                      type="checkbox"
                      checked={privacyAgreement}
                      onChange={handlePrivacyChange}
                      className="privacy-input-rs"
                      required
                    />
                    <span className="privacy-checkmark-rs"></span>
                    <span className="privacy-text-rs">
                      Я даю согласие на обработку моих персональных данных в соответствии с{' '}
                      <button 
                        type="button"
                        className="privacy-link-rs"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPrivacyModalOpen(true);
                        }}
                      >
                        политикой конфиденциальности
                      </button>
                    </span>
                  </label>
                  <div className="privacy-note-rs">
                    <ShieldCheck size={14} />
                    <small>Ваши данные используются только для публикации отзыва и не передаются третьим лицам</small>
                  </div>
                </div>

                <div className="form-note-rs">
                  <small>
                    * Поля, отмеченные звездочкой, обязательны для заполнения. 
                    Все отзывы проходят модерацию перед публикацией.
                  </small>
                </div>

                <button 
                  type="submit" 
                  className="submit-button-rs"
                  disabled={isSubmitting || rating === 0 || !privacyAgreement}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <>
                      <span>Отправить отзыв на модерацию</span>
                      <Send className="submit-icon-rs" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="results-cta-rs">
            <button className="cta-button-rs" onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Начать обучение
              <ArrowRight className="button-icon-rs" />
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Согласие на обработку персональных данных"
      >
        <div className="modal-section">
          <h4>1. Общие положения</h4>
          <p>
            Настоящим я, действуя свободно, по своей воле и в своем интересе, даю согласие 
            на обработку моих персональных данных, указанных при заполнении формы отзыва.
          </p>
        </div>

        <div className="modal-section">
          <h4>2. Состав персональных данных</h4>
          <p>Согласие дается на обработку следующих персональных данных:</p>
          <ul>
            <li>Имя (псевдоним)</li>
            <li>Должность/статус (по желанию)</li>
            <li>Текст отзыва</li>
            <li>Оценка (рейтинг)</li>
            <li>Время отправки отзыва</li>
          </ul>
        </div>

        <div className="modal-section">
          <h4>3. Цели обработки персональных данных</h4>
          <p>Обработка персональных данных осуществляется в целях:</p>
          <ul>
            <li>Публикации отзыва на сайте</li>
            <li>Улучшения качества образовательных услуг</li>
            <li>Информирования потенциальных учеников о результатах обучения</li>
          </ul>
        </div>

        <div className="modal-section">
          <h4>4. Особенности обработки данных для отзывов</h4>
          <ul>
            <li>Отзывы публикуются только после модерации (1-2 рабочих дня)</li>
            <li>Вы можете использовать псевдоним вместо реального имени</li>
            <li>Ваши контактные данные не публикуются</li>
            <li>Отзыв может быть анонимным (без указания имени)</li>
            <li>Вы можете запросить удаление вашего отзыва в любое время</li>
          </ul>
        </div>

        <div className="modal-section">
          <h4>5. Срок действия согласия</h4>
          <p>
            Настоящее согласие действует с момента его предоставления до момента 
            удаления отзыва или отзыва согласия в письменной форме.
          </p>
        </div>

        <div className="modal-section">
          <h4>6. Контактные данные</h4>
          <p>
            Преподаватель: Дарья Александровна
            <br />
            Email: <a href="mailto:daria.gritsaenko2000@gmail.com">daria.gritsaenko2000@gmail.com</a>
            <br />
            Телефон: <a href="tel:+79595203182">+7 (959) 520-31-82</a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ResultsSection;