import { useState } from 'react'

import dice1 from '../../assets/dice-1.png'
import dice2 from '../../assets/dice-2.png'
import dice3 from '../../assets/dice-3.png'
import dice4 from '../../assets/dice-4.png'
import dice5 from '../../assets/dice-5.png'
import dice6 from '../../assets/dice-6.png'
import { Feedback } from '../../components/Feedback'
import { Notification } from '../../components/Notification'

export function Game() {
  const [scores, setScores] = useState([0, 0])
  const [currentScore, setCurrentScore] = useState(0)
  const [activePlayer, setActivePlayer] = useState(0)
  const [dice, setDice] = useState(null)
  const [playing, setPlaying] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [notification, setNotification] = useState('')

  const sendFinalScore = async () => {
    const token = localStorage.getItem('id_token')
    if (!token) return console.error('🚫 No id_token found.')

    const payload = {
      player1Score: scores[0],
      player2Score: scores[1],
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      setNotification('✅ Game successfully saved!')
      setTimeout(() => setNotification(''), 3000)
    } catch (err) {
      console.error('❌ Failed to save score:', err)
      setNotification('❌ Failed to save score.')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  const initGame = () => {
    setScores([0, 0])
    setCurrentScore(0)
    setActivePlayer(0)
    setDice(null)
    setPlaying(true)
    setGameOver(false)
  }

  const switchPlayer = () => {
    setCurrentScore(0)
    setActivePlayer((prev) => (prev === 0 ? 1 : 0))
  }

  const rollDice = () => {
    if (!playing) return

    const roll = Math.trunc(Math.random() * 6) + 1
    setDice(roll)

    if (roll !== 1) {
      setCurrentScore((prev) => prev + roll)
    } else {
      switchPlayer()
    }
  }

  const holdScore = () => {
    if (!playing) return

    const updatedScores = [...scores]
    updatedScores[activePlayer] += currentScore
    setScores(updatedScores)

    if (updatedScores[activePlayer] >= 20) {
      setPlaying(false)
      setDice(null)
      setGameOver(true)
    } else {
      switchPlayer()
    }
  }

  const getDiceImage = (dice) => {
    switch (dice) {
      case 1:
        return dice1
      case 2:
        return dice2
      case 3:
        return dice3
      case 4:
        return dice4
      case 5:
        return dice5
      case 6:
        return dice6
      default:
        return null
    }
  }

  return (
    <main>
      <Notification
        message={notification}
        onClose={() => setNotification('')}
      />

      {showFeedback ? (
        <Feedback setShowFeedback={setShowFeedback} />
      ) : (
        <>
          <section
            className={`player player--0 ${
              activePlayer === 0 ? 'player--active' : ''
            } ${!playing && scores[0] >= 20 ? 'player--winner' : ''}`}
          >
            <h2 className='name'>Player 1</h2>
            <p className='score'>{scores[0]}</p>
            <div className='current'>
              <p className='current-label'>Current</p>
              <p className='current-score'>
                {activePlayer === 0 ? currentScore : 0}
              </p>
            </div>
          </section>

          <section
            className={`player player--1 ${
              activePlayer === 1 ? 'player--active' : ''
            } ${!playing && scores[1] >= 20 ? 'player--winner' : ''}`}
          >
            <h2 className='name'>Player 2</h2>
            <p className='score'>{scores[1]}</p>
            <div className='current'>
              <p className='current-label'>Current</p>
              <p className='current-score'>
                {activePlayer === 1 ? currentScore : 0}
              </p>
            </div>
          </section>

          {dice && (
            <img
              src={getDiceImage(dice)}
              alt={`Dice ${dice}`}
              className='dice'
            />
          )}

          <button className='btn btn--new' onClick={initGame}>
            🔄 New game
          </button>
          <button className='btn btn--roll' onClick={rollDice}>
            🎲 Roll dice
          </button>
          <button className='btn btn--hold' onClick={holdScore}>
            📥 Hold
          </button>
          {gameOver && (
            <button
              className='btn btn--new'
              onClick={sendFinalScore}
              style={{
                top: '100px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                fontWeight: 'bold',
              }}
            >
              💾 Save Scores
            </button>
          )}
          <button
            className='btn btn--feedback'
            onClick={() => setShowFeedback(true)}
          >
            💬 Feedback
          </button>
        </>
      )}
    </main>
  )
}
