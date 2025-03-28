import styles from './AddUser.module.scss';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import userStore from '../../../../store/UserStore';
import { IMaskInput } from 'react-imask';
import type { FieldErrors } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { getUnixTime } from 'date-fns';
import { Link } from 'react-router-dom';
type FormData = {
  name: string;
  surname: string;
  email: string;
  patronymic: string;
  administrative_position: string;
  medical_position: string;
  department: string;
  phone: string;
  hired_at: Date | null;
};

export const AddUserPage = observer(() => {
  useEffect(() => {
    userStore.fetchAvailablePositions();
    userStore.fetchAvailableRoles();
    userStore.fetchAvailableDepartments();
  }, []);

  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      hired_at: null,
    },
  });

  const onValid = (data: FormData) => {
    const newData = {
      ...data,
      hired_at: data.hired_at ? getUnixTime(data.hired_at) : 0,
      is_simple_digital_sign_enabled: false,
    };

    userStore
      .createUser(newData)
      .then(() => alert('Пользователь создан'))
      .catch(() => alert('Что-то пошло не так'));
  };
  const onError = (errors: FieldErrors<FormData>) => {
    console.log(errors);
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      alert(`Ошибка: ${firstError.message}`);
    }
  };

  const values = watch();
  const allFieldsFilled = Object.values(values).every((val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim() !== '';
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.breadСrumbs}>
        <Link to="/admin/organization">
          <img src="/icons/arrow-back.svg" />
          <p>Персоналии</p>
        </Link>
        <p className={styles.breadСrumbs__slash}>/</p>
        <p className={styles.breadСrumbs__currentAddress}>Редактирование карточки сотрудников</p>
      </div>
      <div className={styles.title}>
        <h1>Основные данные сотрудника</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onValid, onError)}>
        <div className={styles.form__field}>
          <label>Фамилия</label>
          <input
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '');
            }}
            placeholder="Введите фамилию"
            className={`input`}
            {...register('surname', { required: 'Обязательное поле' })}
          />
        </div>

        <div className={styles.form__field}>
          <label>Имя</label>
          <input
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '');
            }}
            placeholder="Введите фамилию"
            className={`input`}
            {...register('name', { required: 'Обязательное поле' })}
          />
        </div>

        <div className={styles.form__field}>
          <label>Отчество</label>
          <input
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '');
            }}
            placeholder="Введите отчество"
            className={`input`}
            {...register('patronymic', { required: 'Обязательное поле' })}
          />
        </div>

        <div className={styles.form__field}>
          <label>Административная должность</label>
          <select className={`input`} defaultValue="" {...register('administrative_position', { required: 'Обязательное поле' })}>
            <option value="" disabled>
              Выберите должность
            </option>
            {userStore.availablePositions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form__field}>
          <label>Медицинская должность</label>
          <select {...register('medical_position', { required: 'Обязательное поле' })} defaultValue="" className={`input`}>
            <option value="" disabled>
              Выберите роль
            </option>
            {userStore.availablePositions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form__field}>
          <label>Подразделение</label>
          <select className={`input`} defaultValue="" {...register('department', { required: 'Обязательное поле' })}>
            <option value="" disabled>
              Выберите подразделение
            </option>
            {userStore.availableDepartments.map((dep) => (
              <option key={dep.value} value={dep.value}>
                {dep.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form__field}>
          <label>Телефон</label>
          <Controller name="phone" control={control} rules={{ required: 'Обязательное поле' }} render={({ field }) => <IMaskInput {...field} mask="+7 (000) 000-00-00" placeholder="+7 (___) ___-__-__" className="input" />} />
        </div>

        <div className={styles.form__field}>
          <label>Email:</label>
          <input
            placeholder="Введите ваш E-mail"
            className={`input`}
            {...register('email', {
              required: 'Обязательное поле',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Невалидный email',
              },
            })}
          />
        </div>

        <div className={styles.form__field}>
          <label>Дата принятия на работу</label>
          <Controller
            control={control}
            name="hired_at"
            rules={{ required: 'Обязательное поле' }}
            render={({ field }) => <DatePicker placeholderText="Выберите дату" selected={field.value} onChange={(date) => field.onChange(date)} onBlur={field.onBlur} dateFormat="dd.MM.yyyy" className="input" ref={field.ref} />}
          />
        </div>

        <button style={{ backgroundColor: !allFieldsFilled ? 'rgba(196, 217, 247, 1)' : 'rgba(0, 107, 255, 1)' }} className={`button`} type="submit">
          Добавить
        </button>
      </form>
    </div>
  );
});

export default AddUserPage;
