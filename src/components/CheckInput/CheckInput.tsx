import styles from './CheckInput.module.scss';

interface CheckInput {
  state: boolean;
  onClick?: () => void;
}

export default function CheckInput({ state, onClick }: CheckInput) {
  return (
    <label className={styles.checkbox}>
      <input
        onChange={() => {
          if (onClick) {
            onClick();
          }
        }}
        checked={state}
        type="checkbox"
      />
      <img src="/icons/check.svg" />
    </label>
  );
}
