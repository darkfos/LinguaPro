import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Check, ChevronRight, RefreshCw } from 'lucide-react';
import Modal from '../Modal/Modal';
import './ContactSection.css';
import { api } from '../../utils/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    level: '',
    ageGroup: '',
    frequency: '',
    message: '',
    agreeTerms: false,
    agreeNewsletter: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      alert('Пожалуйста, согласитесь с условиями обработки данных');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.service) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${api}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          level: '',
          ageGroup: '',
          frequency: '',
          message: '',
          agreeTerms: false,
          agreeNewsletter: false
        });
        
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setSubmitError(data.message || 'Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError('Ошибка подключения к серверу. Пожалуйста, попробуйте позже или свяжитесь со мной напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail />,
      title: 'Email',
      value: 'daria.gritsaenko2000@gmail.com',
      description: 'Пишите в любое время'
    },
    {
      icon: <Phone />,
      title: 'Телефон',
      value: '+7 (959) 520-31-82',
      description: 'WhatsApp/Telegram'
    },
    {
      icon: <MapPin />,
      title: 'Формат',
      value: 'Онлайн-занятия',
      description: 'Только онлайн'
    },
    {
      icon: <Clock />,
      title: 'График работы',
      value: 'Пн-Пт: 9:00-19:00',
      description: 'Сб: 9:00-13:00, Вс: выходной'
    }
  ];

  const handleNewBooking = () => {
    setIsSubmitted(false);
  };

  return (
    <>
      <section id="contact" className="contact-section-cs">
        <div className="contact-background-cs">
          <div className="as-ornament as-ornament-1"></div>
          <div className="as-ornament as-ornament-2"></div>
        </div>
        
        <div className="contact-container-cs">
          <div className="contact-header-cs">
            <h2 className="section-title-cs">Запись на занятие</h2>
          </div>

          <div className="contact-content-cs">
            {/* Левая колонка - информация о контактах */}
            <div className="contact-info-cs">
              <div className="contact-info-grid-cs">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-info-card-cs">
                    <div className="contact-info-icon-wrapper-cs">
                      <div className="contact-info-icon-cs">
                        {info.icon}
                      </div>
                    </div>
                    <div className="contact-info-content-cs">
                      <div className="contact-info-title-small-cs">{info.title}</div>
                      <div className="contact-info-value-cs">{info.value}</div>
                      <div className="contact-info-description-cs">{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая колонка - форма */}
            <div className="contact-form-wrapper-cs">
              <div className="contact-form-card-cs">
                {isSubmitted ? (
                  <div className="success-message-cs">
                    <div className="success-icon-wrapper-cs">
                      <Check className="success-icon-cs" />
                    </div>
                    <h3>Заявка отправлена!</h3>
                    <p className="success-text-cs">
                      Свяжусь с вами в течение 24 часов для уточнения деталей
                    </p>
                    <button 
                      className="success-button-cs"
                      onClick={handleNewBooking}
                    >
                      Отправить новую заявку
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="form-title-cs">Заполните форму</h3>
                    <form className="contact-form-cs" onSubmit={handleSubmit}>
                      <div className="form-group-cs">
                        <input
                          type="text"
                          name="name"
                          placeholder="Ваше имя *"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="form-row-cs">
                        <div className="form-group-cs">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="form-group-cs">
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Телефон *"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group-cs">
                        <select 
                          name="service" 
                          value={formData.service}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        >
                          <option value="">Выберите услугу *</option>
                          <option value="english-beginner">Английский с нуля</option>
                          <option value="english-travel">Английский для путешествий</option>
                          <option value="english-conversational">Разговорный английский</option>
                          <option value="english-children">Английский для детей 7+</option>
                          <option value="spanish-beginner">Испанский с нуля</option>
                          <option value="spanish-conversational">Разговорный испанский</option>
                          <option value="exam-prep">Подготовка к ОГЭ/ЕГЭ</option>
                        </select>
                      </div>

                      <div className="form-row-compact-cs">
                        <div className="form-group-cs form-group-small-cs">
                          <select 
                            name="level" 
                            value={formData.level}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="">Уровень</option>
                            <option value="beginner">Начальный</option>
                            <option value="elementary">Elementary (A1)</option>
                            <option value="pre-intermediate">Pre-Intermediate (A2)</option>
                            <option value="intermediate">Intermediate (B1)</option>
                            <option value="upper-intermediate">Upper-Intermediate (B2)</option>
                          </select>
                        </div>
                        <div className="form-group-cs form-group-small-cs">
                          <select 
                            name="ageGroup" 
                            value={formData.ageGroup}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="">Возраст</option>
                            <option value="7-12">7-12 лет</option>
                            <option value="13-17">13-17 лет</option>
                            <option value="18-25">18-25 лет</option>
                            <option value="26-40">26-40 лет</option>
                            <option value="40+">40+ лет</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group-cs">
                        <select 
                          name="frequency" 
                          value={formData.frequency}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <option value="">Предпочтительная частота занятий</option>
                          <option value="1">1 раз в неделю</option>
                          <option value="2">2 раза в неделю</option>
                          <option value="3">3 раза в неделю</option>
                          <option value="more">Чаще</option>
                        </select>
                      </div>
                      
                      <div className="form-group-cs">
                        <textarea
                          name="message"
                          placeholder="Ваши цели или вопросы (например: 'Хочу подготовиться к экзамену', 'Нужен испанский для путешествий', 'Ребенку 10 лет, нужно подтянуть школьную программу')"
                          value={formData.message}
                          onChange={handleChange}
                          rows="3"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-group-checkbox-cs">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                        <label htmlFor="agreeTerms">
                          Я согласен с 
                          <button 
                            type="button"
                            className="privacy-link"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsPrivacyModalOpen(true);
                            }}
                            disabled={isSubmitting}
                          >
                            обработкой персональных данных
                          </button>
                          *
                        </label>
                      </div>

                      <div className="form-group-checkbox-cs">
                        <input
                          type="checkbox"
                          name="agreeNewsletter"
                          id="agreeNewsletter"
                          checked={formData.agreeNewsletter}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <label htmlFor="agreeNewsletter">
                          Хочу получать полезные материалы по изучению языков
                        </label>
                      </div>

                      {submitError && (
                        <div className="error-message-cs">
                          <div className="error-icon-cs">
                            <span>⚠️</span>
                          </div>
                          <p className="error-text-cs">{submitError}</p>
                        </div>
                      )}
                      
                      <button 
                        type="submit" 
                        className="submit-button-cs"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="button-icon-cs spinning" />
                            <span>Отправка...</span>
                          </>
                        ) : (
                          <>
                            <span>Записаться на пробный урок</span>
                            <ChevronRight className="button-icon-cs" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно обработки персональных данных */}
      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Согласие на обработку персональных данных"
      >
        <div className="modal-section">
          <h4>1. Общие положения</h4>
          <p>
            Настоящим я, действуя свободно, по своей воле и в своем интересе, даю согласие 
            на обработку моих персональных данных, указанных при заполнении формы на сайте.
          </p>
        </div>

        <div className="modal-section">
          <h4>2. Состав персональных данных</h4>
          <p>Согласие дается на обработку следующих персональных данных:</p>
          <ul>
            <li>Фамилия, имя, отчество</li>
            <li>Контактный телефон</li>
            <li>Адрес электронной почты</li>
            <li>Возраст/возрастная категория</li>
            <li>Уровень владения языком</li>
            <li>Предпочтения по графику занятий</li>
            <li>Цели изучения языка</li>
          </ul>
        </div>

        <div className="modal-section">
          <h4>3. Цели обработки персональных данных</h4>
          <p>Обработка персональных данных осуществляется в целях:</p>
          <ul>
            <li>Обработки заявок на обучение и консультации</li>
            <li>Связи для уточнения деталей заявки</li>
            <li>Предоставления информации об услугах</li>
            <li>Выполнения обязательств по договору на оказание услуг</li>
          </ul>
        </div>

        <div className="modal-section">
          <h4>4. Срок действия согласия</h4>
          <p>
            Настоящее согласие действует с момента его предоставления и до момента 
            отзыва в письменной форме.
          </p>
        </div>

        <div className="modal-section">
          <h4>5. Контактные данные</h4>
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

export default ContactSection;