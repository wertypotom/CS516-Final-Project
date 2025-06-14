export function Feedback({ setShowFeedback }) {
  return (
    <div className='feedback-form-wrapper'>
      <a
        href='#'
        className='feedback-back'
        onClick={() => setShowFeedback(false)}
      >
        ← Back to Game
      </a>
      <form className='form' name='feedback' netlify='true'>
        <input
          type='text'
          className='in'
          name='name'
          placeholder='Full Name'
          required
        />
        <input
          type='email'
          className='in'
          name='email'
          placeholder='Email ID'
          required
        />
        <input
          type='text'
          className='in'
          name='feedback'
          placeholder='Your Feedback'
          required
        />
        <button type='submit' className='in'>
          Send
        </button>
      </form>
    </div>
  )
}
