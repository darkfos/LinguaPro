import React from 'react';
import { CheckCircle, Book, Clock, AlertCircle, Users, Zap } from 'lucide-react';
import './RulesSection.css';

const RulesSection = () => {
  const handleContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="rules" className="ss-section">
      <div className="ss-background">
        <div className="ss-gradient"></div>
        <div className="ss-blob ss-blob-1"></div>
        <div className="ss-blob ss-blob-2"></div>
        <div className="ss-blob ss-blob-3"></div>
      </div>

      <div className="ss-container">
        <div className="ss-header">
          <h2 className="ss-title">
            Правила <span className="ss-gradient-text">занятий</span>
          </h2>
          <p className="ss-subtitle">
            Для эффективного обучения и комфортной работы всем нам важно соблюдать эти правила
          </p>
        </div>

        {/* Блок с платформой */}
        <div className="ss-consultation-card">
          <div className="ss-consultation-content">
            <div className="ss-consultation-icon-wrapper">
              <Users className="ss-consultation-icon" />
            </div>
            <div className="ss-consultation-text">
              <h3>Платформа для занятий</h3>
              <p>Все занятия проходят на платформе Microsoft Teams.</p>
              <div className="ss-consultation-details">
                <div className="ss-detail-item">
                  <CheckCircle className="ss-detail-icon" />
                  <span>Видео- и аудиосвязь</span>
                </div>
                <div className="ss-detail-item">
                  <CheckCircle className="ss-detail-icon" />
                  <span>Общий экран</span>
                </div>
                <div className="ss-detail-item">
                  <CheckCircle className="ss-detail-icon" />
                  <span>Интерактивная доска</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Что понадобится */}
        <div className="ss-info-section">
          <div className="ss-info-card">
            <Book className="ss-info-icon" />
            <div className="ss-info-content">
              <h4>Что нужно для занятий</h4>
              <p>• Толстый блокнот для слов<br/>
                 • Тетрадь 96 листов для правил<br/>
                 • Тетрадь для домашнего задания<br/>
                 • Ручки, карандаши</p>
            </div>
          </div>
          <div className="ss-info-card">
            <Zap className="ss-info-icon" />
            <div className="ss-info-content">
              <h4>Подготовка к уроку</h4>
              <p>• Гаджеты должны быть заряжены<br/>
                 • Тетради и ручки под рукой<br/>
                 • Выполнено домашнее задание<br/>
                 • Настроиться на занятие</p>
            </div>
          </div>
        </div>

        {/* Правила */}
        <div className="ss-languages-grid">
          {/* Левая колонка правил */}
          <div className="ss-language-card">
            <div className="ss-card-header">
              <div className="ss-language-icon-wrapper">
                <CheckCircle className="ss-language-icon" />
              </div>
              <div className="ss-language-title">
                <h3>Основные правила</h3>
                <p>Важные моменты нашей работы</p>
              </div>
            </div>

            <div className="ss-pricing-table" style={{border: 'none', padding: 0}}>
              <div className="ss-price-row" style={{background: 'transparent', border: '1px solid #e5e7eb'}}>
                <div className="ss-price-info">
                  <span className="ss-price-name" style={{color: '#111827'}}>1. Мотивация и желание</span>
                  <span className="ss-price-desc">Работаю с теми, кто действительно хочет заниматься! Если ситуация "заставила мама" — у меня много примеров, что из этого ничего хорошего не выйдет. ДЕЙСТВИТЕЛЬНО желаешь выучить язык — велком!</span>
                </div>
              </div>
              <div className="ss-price-row" style={{background: 'transparent', border: '1px solid #e5e7eb'}}>
                <div className="ss-price-info">
                  <span className="ss-price-name" style={{color: '#111827'}}>2. Домашнее задание</span>
                  <span className="ss-price-desc">Выполнять полноценно домашнее задание. Если ваша цель — выучить язык, то нужно прикладывать усилия. Домашнее задание — это практика для отработки изученного материала. Чем лучше закрепите, тем быстрее увидите результат.</span>
                </div>
              </div>
              <div className="ss-price-row ss-featured" style={{background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6'}}>
                <div className="ss-price-info">
                  <span className="ss-price-name" style={{color: '#111827'}}>3. Время и терпение</span>
                  <span className="ss-price-desc">На изучение любого языка нужно время. Выучить за 3 месяца язык невозможно. Будьте готовы к этому, наберитесь терпения — и тогда результат не заставит вас ждать.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка правил */}
          <div className="ss-language-card">
            <div className="ss-card-header">
              <div className="ss-language-icon-wrapper">
                <Clock className="ss-language-icon" />
              </div>
              <div className="ss-language-title">
                <h3>Расписание и оплата</h3>
                <p>Организационные моменты</p>
              </div>
            </div>

            <div className="ss-pricing-table" style={{border: 'none', padding: 0}}>
              <div className="ss-price-row" style={{background: 'transparent', border: '1px solid #e5e7eb'}}>
                <div className="ss-price-info">
                  <span className="ss-price-name" style={{color: '#111827'}}>4. Отмены и переносы</span>
                  <span className="ss-price-desc">Отменять или переносить занятия нужно предупреждать как минимум за 24 часа. Если отмена происходит в день занятия — урок оплачивается как полноценный. Уважайте мое и свое время.</span>
                </div>
              </div>
              <div className="ss-price-row" style={{background: 'transparent', border: '1px solid #e5e7eb'}}>
                <div className="ss-price-info">
                  <span className="ss-price-name" style={{color: '#111827'}}>5. Техническая готовность</span>
                  <span className="ss-price-desc">К началу урока будьте готовы: гаджеты заряжены, интернет стабильный, все материалы под рукой. Мы не тратим время урока на технические проблемы.</span>
                </div>
              </div>
              <div className="ss-price-row" style={{background: 'transparent', border: '1px solid #e5e7eb', textAlign: 'center', justifyContent: 'center'}}>
                <div className="ss-price-info">
                  <span className="ss-price-name" style={{color: '#111827', fontSize: '1.1rem', textAlign: 'center'}}>
                    Если вам это откликается, жду вас на занятии!
                  </span>
                </div>
              </div>
            </div>

            <button className="ss-language-btn" onClick={handleContact}>
              Начать заниматься
            </button>
          </div>
        </div>

        {/* Важное примечание */}
        <div className="ss-special-offer">
          <div className="ss-offer-content">
            <div className="ss-offer-icon-wrapper">
              <AlertCircle className="ss-offer-icon" />
            </div>
            <div className="ss-offer-text">
              <div className="ss-offer-badge">Важно знать</div>
              <h3>Результат требует усилий</h3>
              <p>Изучение языка — это совместная работа. С моей стороны — качественное преподавание и поддержка. С вашей — регулярность занятий и выполнение заданий. Вместе мы достигнем ваших целей!</p>
            </div>
            <button className="ss-offer-btn" onClick={handleContact}>
              Готов начать
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;