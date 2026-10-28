const button = document.querySelector('#dictate')
const transcript = document.querySelector('#transcript')
const status = document.querySelector('#status')
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

let active = null
let started = false
let hadError = false
let source = null
let pointerId = null
let keyHeld = null

if (!SpeechRecognition) {
  button.disabled = true
  status.textContent = 'Speech recognition is not available in this browser.'
}

function begin(input, id = null) {
  if (!SpeechRecognition || active) return

  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = document.documentElement.lang || 'en-US'

  const previous = transcript.value
  started = false
  hadError = false
  active = recognition
  source = input
  pointerId = id
  transcript.readOnly = true
  button.setAttribute('aria-pressed', 'true')
  status.textContent = 'Starting microphone…'

  recognition.onstart = () => {
    started = true
    if (!source) recognition.stop()
    else status.textContent = 'Listening…'
  }

  recognition.onresult = (event) => {
    const parts = []
    for (let i = 0; i < event.results.length; i++) {
      parts.push(event.results[i][0].transcript.trim())
    }
    const words = parts.filter(Boolean).join(' ')
    transcript.value = previous + (previous && words && !/\s$/.test(previous) ? ' ' : '') + words
    transcript.scrollTop = transcript.scrollHeight
  }

  recognition.onerror = (event) => {
    hadError = true
    status.textContent = `Speech recognition error: ${event.error}.`
  }

  recognition.onend = () => {
    active = null
    started = false
    source = null
    pointerId = null
    keyHeld = null
    transcript.readOnly = false
    button.setAttribute('aria-pressed', 'false')
    if (!hadError) status.textContent = 'Ready'
  }

  try {
    recognition.start()
  } catch (err) {
    active = null
    started = false
    source = null
    pointerId = null
    keyHeld = null
    transcript.readOnly = false
    button.setAttribute('aria-pressed', 'false')
    status.textContent = `Could not start microphone: ${err.message}`
  }
}

function finish() {
  if (!source || !active) return
  source = null
  pointerId = null
  keyHeld = null
  button.setAttribute('aria-pressed', 'false')
  if (!hadError) status.textContent = 'Finishing…'
  // If permission is still pending, onstart will stop recognition when it arrives.
  if (started) active.stop()
}

button.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || !event.isPrimary) return
  event.preventDefault()
  begin('pointer', event.pointerId)
})

window.addEventListener('pointerup', (event) => {
  if (source === 'pointer' && event.pointerId === pointerId) finish()
})
window.addEventListener('pointercancel', (event) => {
  if (source === 'pointer' && event.pointerId === pointerId) finish()
})

button.addEventListener('keydown', (event) => {
  if (event.key !== ' ' && event.key !== 'Enter') return
  event.preventDefault()
  if (event.repeat || active) return
  begin('keyboard')
  keyHeld = event.key
})
window.addEventListener('keyup', (event) => {
  if (source === 'keyboard' && event.key === keyHeld) finish()
})
window.addEventListener('blur', finish)
