import Modal from "./Modal";

export default function ConfirmDialog({
                                        open,
                                        title = "Confirmar",
                                        description,
                                        confirmText = "Eliminar",
                                        cancelText = "Cancelar",
                                        danger = true,
                                        onConfirm,
                                        onClose,
                                        loading,
                                      }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={loading ? undefined : onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={[
              "rounded-md px-3 py-2 text-xs font-medium disabled:opacity-60",
              danger
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-accent text-slate-950 hover:opacity-90",
            ].join(" ")}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-300">{description}</p>
    </Modal>
  );
}
