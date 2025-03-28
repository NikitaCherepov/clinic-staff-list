import { Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import Menu from '../components/Menu/Menu';

export default function AdminLayout() {
  return (
    <main className={styles.container}>
      <Menu />
      <Outlet />
    </main>
  );
}
