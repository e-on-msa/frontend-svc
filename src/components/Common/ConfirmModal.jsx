import styles from "../../styles/Common/ConfirmModal.module.css";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={onCancel}>
                        취소
                    </button>
                    <button className={styles.confirm} onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
