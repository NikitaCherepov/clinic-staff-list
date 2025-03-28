import { Link } from 'react-router-dom';
import styles from './MainPage.module.scss';

export default function MainPage() {
  return (
    <div className={styles.container}>
      <h1>Тестовое задание</h1>
      <p>
        Перейти в <Link to="/admin/organization">штатное расписание</Link>
      </p>
    </div>
  );
}
