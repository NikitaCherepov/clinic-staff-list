import styles from './Organization.module.scss';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../../../store/UserStore';
import Schedule from './Schedule/Schedule';

export const Organization = observer(() => {
  const [sections, setSections] = useState([
    {
      name: 'Карточка организации',
      id: crypto.randomUUID(),
      type: 'card',
      chosen: false,
    },
    {
      name: 'Обособленные подразделения',
      id: crypto.randomUUID(),
      type: 'division',
      chosen: false,
    },
    {
      name: 'Штатное расписание',
      id: crypto.randomUUID(),
      type: 'schedule',
      chosen: true,
    },
    {
      name: 'Исполнительный орган по ВККиБМД',
      id: crypto.randomUUID(),
      type: 'executive',
      chosen: false,
    },
    {
      name: 'Мониторинг',
      id: crypto.randomUUID(),
      type: 'monitoring',
      chosen: false,
    },
  ]);

  useEffect(() => {
    userStore.fetchUsers();
  }, []);

  const activeSection = (type: string) => {
    const chosenSection = sections.find((e) => e.type === type && e.chosen);
    return chosenSection;
  };

  const chooseSection = (id: string) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, chosen: true } : { ...section, chosen: false })));
  };

  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        {sections.map((section) => (
          <button onClick={() => chooseSection(section.id)} key={section.id} className={`${styles.sections__section} ${section.chosen ? styles.sections__section_chosen : ''}`}>
            {section.name}
          </button>
        ))}
      </div>

      {activeSection('schedule') ? <Schedule /> : <div>Другое...</div>}
    </div>
  );
});

export default Organization;
