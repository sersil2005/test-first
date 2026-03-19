async function loadQuestions() {
    try {
        const body = document.querySelector('.body')
        const form = document.querySelector('form')
        const button = document.getElementById('send')
        const response = await fetch("question.json")
        const data = await response.json()

        const html = data.questions.map(elements => {
            return `
           <p id="question">${elements.Question}</p> 
           <div class="option-one">
                <input type="radio" name="number-${elements.id}" id="succ-${elements.id}" value="succ" required>
                <label for="succ-${elements.id}">Si</label>
            </div>

            <div class="option-two">
                <input type="radio" name="number-${elements.id}" id="err-${elements.id}" value="err" required>
                <label for="err-${elements.id}">No</label>
            </div>
        `
        }).join('')
        form.innerHTML = html

        form.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                const questionId = e.target.name
                const questionRes = e.target.value

                console.log(`Pregunta: ${questionId}, Respuesta: ${questionRes}`);
            }
        })

        button.addEventListener('click', async () => {
            button.disabled = true
            button.style.cursor = 'wait'

            const formData = new FormData(form)
            const dataToSend = []

            let totalQuestions = data.questions.length

            for (const [key, value] of formData.entries()) {
                dataToSend.push({
                    id: key.replace('number-', ''),
                    response: value
                })
            }

            if (dataToSend.length < totalQuestions) {
                alert('Responda todas las preguntas')
                return
            }

            const URL = 'https://script.google.com/macros/s/AKfycbwZvYZ-FLaYgqf1PLlKERlcz8SoMIy0t6OrCVGFfzaFMFWWMEoUgIP-b1G3h2cEMSt7/exec'
            const controller = new AbortController()
            const timeOutId = setTimeout(() => controller.abort(), 30000)

            try {
                const response = await fetch(URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: JSON.stringify(dataToSend),
                    signal: controller.signal
                })
                console.log('Datos enviados', dataToSend)
                clearTimeout(timeOutId)

            } catch (error) {
                if (error.name === 'AbortError') {
                    alert('Se agotó el tiempo')
                } else {
                    console.log('Error al enviar: ', err)
                }
            } finally {
                button.disabled = false
                button.style.cursor = 'pointer'
            }
        })


    } catch (err) {
        console.error(err)
    }
}

async function sendRess() {
    const form = document.querySelector('form')

}

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    loadQuestions()
})