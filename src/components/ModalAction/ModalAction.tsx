import styles from './ModalAction.module.scss';

export interface modalContent {
  title: string;
  description: string;
  onClick: () => void;
  confirm: string;
}

export interface modalProps {
  modalContent: modalContent;
  show: boolean;
  close: () => void;
}

export default function ModalAction({ modalContent, show, close }: modalProps) {
  if (show)
    return (
      <div className={styles.container}>
        <div className={styles.modal}>
          <h2>{modalContent.title}</h2>
          <div>
            {modalContent.description.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          <div className={styles.modal__buttons}>
            <button
              onClick={() => {
                modalContent.onClick();
                close();
              }}
              className={`button ${styles.modal__buttons__confirm}`}
            >
              {modalContent.confirm}
            </button>
            <button onClick={() => close()} className={`button ${styles.modal__buttons__cancel}`}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
}
