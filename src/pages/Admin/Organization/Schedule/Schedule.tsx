import styles from './Schedule.module.scss';
import { observer } from 'mobx-react-lite';
import userStore from '../../../../store/UserStore';
import Pagination from '../../../../components/Pagination/Pagination';
import MultiFilter from '../../../../components/MultiFilter/MultiFilter';
import CheckInput from '../../../../components/CheckInput/CheckInput';
import MultiFilterInput from '../../../../components/MultiFilterInput/MultiFilterInput';
import { useState } from 'react';
import { modalContent } from '../../../../components/ModalAction/ModalAction';
import ModalAction from '../../../../components/ModalAction/ModalAction';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

export const Schedule = observer(() => {
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) return phone;

    const formatted = `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
    return formatted;
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<modalContent>({
    title: '',
    description: '',
    onClick: () => {},
    confirm: '',
  });
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };
  const openModal = (title: string, description: string, onClick: () => void, confirm: string) => {
    setModalContent({
      title: title,
      description: description,
      onClick: onClick,
      confirm: confirm,
    });
    toggleModal();
  };

  return (
    <div style={userStore.loading ? { justifyContent: 'space-between' } : undefined} className={styles.container}>
      {showModal && modalContent.title && <ModalAction close={() => toggleModal()} modalContent={modalContent} show={showModal} />}

      <div className={styles.title}>
        <h1>Штатное расписание</h1>
        <Link to="/admin/addUser" className={`button`}>
          Добавить сотрудника
        </Link>
      </div>

      <div className={styles.filters}>
        <MultiFilterInput
          onChange={(fullName: string) => {
            userStore.fetchFullNames(fullName);
          }}
          onClick={(id) => userStore.toggleFullNameOption(id)}
          options={userStore.fullNameOptions}
          className={undefined}
        />
        <MultiFilter selectedOptions={userStore.selectedFullNameOptions} onClick={(id) => userStore.toggleFullNameOption(id)} options={userStore.fullNameOptions} className={undefined} />
      </div>

      <div className={styles.checkBoxFilters}>
        <div className={styles.checkBoxFilters__filter}>
          <CheckInput state={userStore.firedOnly} onClick={() => userStore.toggleFiredOnlyFilter()} />
          <p>Отображать уволенных</p>
        </div>
      </div>

      {userStore.error ? (
        <div>Ошибка: {userStore.error}</div>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={`hoverEffect`} onClick={() => userStore.changeSort('id')}>
              id
            </div>
            <div>ℹ️</div>
            <div className={`hoverEffect`} onClick={() => userStore.changeSort('surname')}>
              <p>ФИО</p>
            </div>
            <div>
              <p>Телефон</p>
            </div>
            <div>
              <p>E-mail</p>
            </div>
            <div>
              <p>Пароль</p>
            </div>
            <div>
              <p>Должность</p>
            </div>
            <div>
              <p>Роль в ВКК</p>
            </div>
            <div>
              <p>Статус УЗ</p>
            </div>
            <div>
              <p>ПЭП</p>
            </div>
            <div>
              <p>Дата приёма</p>
            </div>
            <div>
              <p>Дата увольнения</p>
            </div>
          </div>

          {userStore.users
            .filter((user) => (userStore.firedOnly ? user.status.value === 'dismissed' : true))
            .map((user) => (
              <div className={styles.userRow} key={user.id}>
                <CheckInput state={false} />
                <div
                  onClick={() =>
                    openModal(
                      'Информация о сотруднике',
                      `Имя: ${user.surname} ${user.name} ${user.patronymic}\nE-mail: ${user.email}\nТелефон: ${user.phone}\nПодразделение: ${user.department.label}\nДолжность: ${user.administrative_position.label || '-'}\nМедицинская должность: ${user.medical_position.label || '-'}\nСтатус: ${user.status.label}\nПЭП: ${user.is_simple_digital_sign_enabled ? 'Да' : 'Нет'}\nПринят: ${new Date(user.hired_at * 1000).toLocaleDateString()}\nУволен: ${user.fired_at ? new Date(user.fired_at * 1000).toLocaleDateString() : '—'}`,
                      () => {},
                      'Выйти'
                    )
                  }
                  className={`hoverEffect`}
                >
                  ℹ️
                </div>
                <div data-tooltip-id={`user-tooltip-${user.id}`} data-tooltip-content={`${user.surname} ${user.name} ${user.patronymic}`}>
                  <p>
                    {user.surname} {user.name} {user.patronymic}
                  </p>
                </div>
                <Tooltip id={`user-tooltip-${user.id}`} place="top" className={`custom-tooltip`} />
                <div data-tooltip-id={`user-tooltip-${user.phone}`} data-tooltip-content={formatPhone(user.phone)}>
                  <p>{formatPhone(user.phone)}</p>
                  <img className={`${styles.userRow__icon} hoverEffect`} src="/icons/copy.svg" />
                </div>

                <Tooltip id={`user-tooltip-${user.phone}`} place="top" className={`custom-tooltip`} />
                <Tooltip id={`user-tooltip-${user.email}`} place="top" className={`custom-tooltip`} />
                <div data-tooltip-id={`user-tooltip-${user.email}`} data-tooltip-content={`${user.email}`}>
                  <p>{user.email}</p>
                  <img className={`${styles.userRow__icon} hoverEffect`} src="/icons/copy.svg" />
                </div>
                <div>
                  <p>•••</p>
                  <img className={`${styles.userRow__icon} hoverEffect`} src="/icons/eye.svg" />
                </div>
                <Tooltip id={`user-tooltip-adm-${user.id}`} place="top" className="custom-tooltip" />
                <div data-tooltip-id={`user-tooltip-adm-${user.id}`} data-tooltip-content={`${user.administrative_position?.label || '—'}`}>
                  <p>{user.administrative_position?.label || '—'}</p>
                </div>

                <Tooltip id={`user-tooltip-med-${user.id}`} place="top" className="custom-tooltip" />
                <div data-tooltip-id={`user-tooltip-med-${user.id}`} data-tooltip-content={`${user.medical_position?.label || '—'}`}>
                  <p>{user.medical_position?.label || '—'}</p>
                </div>

                <div>
                  <p>{user?.status.label}</p>
                </div>

                <div>
                  <CheckInput state={user.is_simple_digital_sign_enabled} />
                </div>
                <div>
                  <p>{new Date(user.hired_at * 1000).toLocaleDateString()}</p>
                </div>
                <div>
                  <p>{user.fired_at ? new Date(user.fired_at * 1000).toLocaleDateString() : ''}</p>
                </div>
                <div>
                  <button
                    onClick={() =>
                      openModal(
                        'Увольнение сотрудника',
                        'Это действие будет невозможно отменить. Вы действительно хотите уволить сотрудника?\n Он навсегда потеряет доступ к своей учетной записи, если таковая была. Все созданные им документы и сделанные изменения в документах сохранятся. Также карточка данного сотрудника будет храниться в вашей базе данных.',
                        () => userStore.deleteUser(user.id.toString()),
                        'Уволить'
                      )
                    }
                    className={`button ${styles.userRow__fireButton}`}
                  >
                    Уволить
                  </button>
                </div>
                <div>
                  <img className={`${styles.userRow__icon} hoverEffect`} src="/icons/edit.svg" />
                </div>
                <div>
                  <img
                    onClick={() =>
                      openModal(
                        'Блокировка сотрудника',
                        'Это действие будет можно отменить. Вы действительно хотите заблокировать сотрудника?\nНа время блокировки сотрудник потеряет доступ к своей учётной записи, если таковая существует. Все созданные им документы и сделанные изменения в документах сохранятся. Также карточка данного сотрудника будет храниться в вашей базе данных.',
                        () => {},
                        'Заблокировать'
                      )
                    }
                    className={`${styles.userRow__icon} hoverEffect`}
                    src="/icons/lock-open.svg"
                  />
                </div>
                <div>
                  <img
                    onClick={() =>
                      openModal(
                        'Удаление карточки сотрудника',
                        'Это действие будет невозможно отменить. Вы действительно хотите удалить карточку сотрудника?\n\nПосле этого сотрудник навсегда потеряет доступ к своей учётной записи, если таковая существует. Также карточка данного сотрудника будет безвозвратно удалена из вашей базы данных.\n\nВсе созданные им документы и сделанные изменения в документах сохранятся.',
                        () => userStore.deleteUser(user.id.toString()),
                        'Удалить карточку'
                      )
                    }
                    className={`${styles.userRow__icon} hoverEffect`}
                    src="/icons/trash-bin.svg"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      <Pagination className={styles.pagination} page={userStore.page} lastPage={userStore.lastPage} setPage={(n: number) => userStore.setPage(n)} />
    </div>
  );
});

export default Schedule;
