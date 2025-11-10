import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { GoogleGenAI } from '@google/genai'

const app = express()
const upload = multer({ dest: 'uploads/' })

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

const GEMINI_MODEL = 'gemini-1.5-flash'
app.use(express.json())

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body
    try {
        const response = await ai.generateText({
            model: GEMINI_MODEL,
            prompt: prompt,
        })
        res.status(200).json({ text: response.text }) 
    } catch (error) {
        console.error('Error generating text:', error)
        res.status(500).json({ error: error.message }) // changed: use error.message
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.post('/generate-image', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path
        const imageData = fs.readFileSync(imagePath)

        const response = await ai.generateImage({
            model: GEMINI_MODEL,
            image: imageData,
        })
        res.status(200).json({ image: response.image })
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: error.message })
    }
})
