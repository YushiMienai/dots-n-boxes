interface ResetConfirmModalProps {
  isOpen: boolean
  requesterName?: string
  onConfirm: () => void
  onDecline: () => void
}

export const ResetConfirmModal = (
  {isOpen, requesterName = 'Соперник', onConfirm, onDecline}: ResetConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        className="modal-dialog"
      >
        <h2 className="modal-title">
          Сбросить игру?
        </h2>

        <p className="modal-description">
          <strong>{requesterName}</strong> предлагает начать партию заново. Весь текущий прогресс будет потерян.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onDecline}
            className="modal-btn-decline"
          >
            Отказаться
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="modal-btn-confirm"
          >
            Согласиться
          </button>
        </div>
      </div>
    </div>
  )
}
