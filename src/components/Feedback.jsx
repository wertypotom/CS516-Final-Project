import { useState } from 'react'

export function Feedback({ setShowFeedback }) {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    feedback: '',
  })

  const sendFeedback = async () => {
    const token = localStorage.getItem('id_token')
    if (!token) return console.error('🚫 No id_token found.')

    const payload = {
      fullName: feedback.name,
      email: feedback.email,
      feedback: feedback.feedback,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log('✅ Game saved to DB:', result)
    } catch (err) {
      console.error('❌ Failed to save score:', err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendFeedback()
    setFeedback({ name: '', email: '', feedback: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFeedback((prev) => ({ ...prev, [name]: value }))
  }

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
          onChange={handleChange}
          type='text'
          className='in'
          name='name'
          placeholder='Full Name'
          required
          value={feedback.name}
        />
        <input
          onChange={handleChange}
          type='email'
          className='in'
          name='email'
          placeholder='Email ID'
          required
          value={feedback.email}
        />
        <input
          value={feedback.feedback}
          onChange={handleChange}
          type='text'
          className='in'
          name='feedback'
          placeholder='Your Feedback'
          required
        />
        <button onClick={handleSubmit} type='submit' className='in'>
          Send
        </button>
      </form>
    </div>
  )
}
