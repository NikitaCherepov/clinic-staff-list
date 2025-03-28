import styles from './Menu.module.scss';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Menu() {
  const [menu, setMenu] = useState([
    {
      name: 'Личный кабинет',
      type: 'section',
      open: true,
      id: crypto.randomUUID(),
      elements: [
        {
          name: 'Структура ВКК',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/structure.svg',
          link: 'structure',
        },
        {
          name: 'Организация',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/organization.svg',
          link: 'organization',
        },
        {
          name: 'Реестр документов ВКК',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/reestr.svg',
          link: 'registry',
        },
        {
          name: 'Календарь ВКК',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/calendar.svg',
          link: 'calendar',
        },
        {
          name: 'Тарифы и оплата',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/payment.svg',
          link: 'payment',
        },
      ],
    },
    {
      name: 'Рабочее пространство',
      type: 'section',
      open: true,
      id: crypto.randomUUID(),
      elements: [
        {
          name: 'Руководитель МО',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'head-mo',
        },
        {
          name: 'Ответственное лицо',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'responsible',
        },
        {
          name: 'Уполномоченное лицо',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'authorized',
        },
        {
          name: 'Председатель ВК',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'chairman',
        },
        {
          name: 'Секретарь ВК',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'secretary',
        },
        {
          name: 'Член ВК',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'member',
        },
        {
          name: 'Администратор клиники',
          id: crypto.randomUUID(),
          chosen: false,
          icon: '/images/menu/star.svg',
          link: 'admin-clinic',
        },
      ],
    },
  ]);
  const location = useLocation();
  console.log(location.pathname);

  const openSection = (id: string) => {
    setMenu((prev) => prev.map((obj) => (obj.id === id ? { ...obj, open: !obj.open } : obj)));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.header__logo} src="/images/menu/logo.svg"></img>

        <div className={styles.header__text}>
          <h1>СБ21</h1>
          <p>Секретарь ВКК</p>
        </div>
      </div>

      {menu.map((section) => (
        <div key={section.id} className={styles.section}>
          <div onClick={() => openSection(section.id)} className={styles.section__header}>
            <p>{section.name}</p>
            <img src="/images/menu/arrow.svg" />
          </div>

          {section.open &&
            section.elements.map((element) => (
              <Link key={element.id} to={element.link} className={`${styles.section__element} ${location.pathname === `/admin/${element.link}` ? styles.section__element_chosen : ''}`}>
                <img src={element.icon} />
                <p>{element.name}</p>
              </Link>
            ))}
        </div>
      ))}

      <div className={`${styles.section__element} ${styles.about}`}>
        <img src="/images/menu/star.svg" />
        <p>О сервисе</p>
      </div>
    </div>
  );
}
