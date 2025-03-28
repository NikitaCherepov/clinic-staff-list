import CheckInput from '../CheckInput/CheckInput';
import styles from './MultiFilter.module.scss';
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
  selectedOptions: optionsType[];
}

export default function MultiFilter({ className, onClick, selectedOptions }: OptionsProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className={`${styles.container} ${className}`}>
      {selectedOptions.map(
        (option, index) =>
          option.chosen &&
          index < 3 && (
            <div key={index} className={styles.container__option}>
              <p>{option.name}</p>
              <img onClick={() => onClick(option.id)} className="hoverEffect" src="/icons/close.svg" />
            </div>
          )
      )}
      {openModal && (
        <div className={styles.modal}>
          {selectedOptions.map((obj, index) => (
            <div key={index} className={styles.modal__option}>
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
