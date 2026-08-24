interface ErrorProps {
  simulationId: string
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorProps) {
  return (
    <div className="text-destructive flex flex-col gap-3 text-sm">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-primary underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}
