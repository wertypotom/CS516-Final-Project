export function Notification({ message, onClose }) {
  if (!message) return null

  return (
    <div className='notification'>
      <p>{message}</p>
      <button onClick={onClose}>✖</button>
    </div>
  )
}
