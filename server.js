import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public', {
  maxAge: '1y',
  etag: true,
}))

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`coinflip running on :${PORT}`))
