import CheckInput from '../CheckInput/CheckInput';
import styles from './MultiFilterInput.module.scss';
import { useState } from 'react';

interface optionsType {
  name: string;
  chosen: boolean;
  id: string;
}

interface OptionsProps {
  className: string | undefined;
  options: optionsType[];
  onClick: (id: string) => void;
  onChange: (name: string) => void;
}

export default function MultiFilterInput({ className, options, onClick, onChange }: OptionsProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className={`${styles.container} ${className}`}>
      <input
        onChange={(e) => {
          if (e.target.value) {
            if (!openModal) {
              setOpenModal(() => true);
            }
            onChange(e.target.value);
          } else {
            setOpenModal(() => false);
          }
        }}
        className={styles.input}
      />
      {openModal && (
        <div className={styles.modal}>
          {options.map((obj) => (
            <div className={styles.modal__option}>
              <CheckInput onClick={() => onClick(obj.id)} state={obj.chosen} />
              {obj.name}
            </div>
          ))}
        </div>
      )}
      <div onClick={() => setOpenModal((prev) => !prev)} className={styles.container__arrowOpen}>
        <img src="/images/menu/arrow.svg" />
      </div>
    </div>
  );
}
