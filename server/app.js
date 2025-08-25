const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
app.use(express.json())

//CORS EKLENDİ
const cors = require('cors')
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)
// Gizli anahtarlar (production'da bunlar .env dosyasında olmalı)
const ACCESS_TOKEN_SECRET = 'your-access-token-secret-key-2024'
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret-key-2024'

// Test modu - şifre kontrolünü basitleştir
const TEST_MODE = true

// Basit kullanıcı veritabanı (memory'de)
const users = [
    {
        id: 1,
        username: 'admin',
        password: '123456', // TEST_MODE true ise plain text, false ise hash'lenecek
        email: 'admin@example.com',
    },
    {
        id: 2,
        username: 'user',
        password: '123456',
        email: 'user@example.com',
    },
]

// Refresh token'ları saklayacağımız basit store
let refreshTokens = []

// Token oluşturma fonksiyonları
function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // Access token 15 dakika geçerli
    )
}

function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Refresh token 7 gün geçerli
    )
}

// Middleware: Token doğrulama
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token bulunamadı' })
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ error: 'Geçersiz veya süresi dolmuş token' })
        }
        req.user = user
        next()
    })
}

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        message: 'JWT Auth API',
        testMode: TEST_MODE,
        endpoints: {
            login: 'POST /login - { username, password }',
            register: 'POST /register - { username, password, email }',
            refresh: 'POST /token/refresh - { refreshToken }',
            logout: 'POST /logout - { refreshToken }',
            profile: 'GET /profile - Bearer token gerekli',
            protected: 'GET /protected - Bearer token gerekli',
        },
    })
})

// Kullanıcı kayıt
app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body

        // Validasyon
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: 'Kullanıcı adı ve şifre gerekli' })
        }

        // Kullanıcı zaten var mı kontrol et
        const existingUser = users.find((u) => u.username === username)
        if (existingUser) {
            return res
                .status(409)
                .json({ error: 'Bu kullanıcı adı zaten kullanılıyor' })
        }

        // Yeni kullanıcı oluştur
        const newUser = {
            id: users.length + 1,
            username,
            password: TEST_MODE ? password : await bcrypt.hash(password, 10),
            email: email || `${username}@example.com`,
        }

        users.push(newUser)

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        })
    } catch (error) {
        res.status(500).json({ error: 'Kayıt işlemi başarısız' })
    }
})

// Giriş endpoint'i
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        // Kullanıcıyı bul
        const user = users.find((u) => u.username === username)
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Kullanıcı adı veya şifre hatalı' })
        }

        // Şifreyi kontrol et
        let validPassword = false

        if (TEST_MODE) {
            // Test modunda direkt string karşılaştırması
            validPassword = user.password === password
        } else {
            // Production modunda bcrypt karşılaştırması
            validPassword = await bcrypt.compare(password, user.password)
        }

        if (!validPassword) {
            return res.status(401).json({
                error: 'Kullanıcı adı veya şifre hatalı',
                debug: TEST_MODE
                    ? `Beklenen: ${user.password}, Gönderilen: ${password}`
                    : undefined,
            })
        }

        // Token'ları oluştur
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        // Refresh token'ı sakla
        refreshTokens.push(refreshToken)

        res.json({
            message: 'Giriş başarılı',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            error: 'Giriş işlemi başarısız',
            details: error.message,
        })
    }
})

// Token yenileme
app.post('/token/refresh', (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token gerekli' })
    }

    // Refresh token geçerli mi?
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: 'Geçersiz refresh token' })
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ error: 'Refresh token doğrulanamadı' })
        }

        // Yeni access token oluştur
        const accessToken = generateAccessToken({
            id: user.id,
            username: user.username,
        })

        res.json({
            accessToken,
            message: 'Token başarıyla yenilendi',
        })
    })
})

// Çıkış
app.post('/logout', (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token gerekli' })
    }

    // Refresh token'ı listeden kaldır
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)

    res.json({ message: 'Çıkış başarılı' })
})

// Korumalı route - Kullanıcı profili
app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find((u) => u.id === req.user.id)

    if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' })
    }

    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    })
})

// Korumalı route örneği
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'Bu korumalı bir endpoint!',
        user: req.user,
        timestamp: new Date().toISOString(),
    })
})

// Books
app.get('/books', authenticateToken, (req, res) => {
    const data = require('./books.json')

    res.json({
        message: "Bu korumalı bir kitaplar endpoint'i!",
        lists: data,
        timestamp: new Date().toISOString(),
    })
})

// Tüm kullanıcıları listele (test için)
app.get('/users', (req, res) => {
    res.json({
        testMode: TEST_MODE,
        users: users.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            // Test modunda şifreleri de göster
            password: TEST_MODE ? u.password : '***',
        })),
        note: TEST_MODE
            ? 'Test modu aktif - şifreler plain text'
            : "Şifreler hash'lenmiş",
    })
})

// Server'ı başlat
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`
🚀 JWT Auth Server başlatıldı!
🔗 http://localhost:${PORT}
⚙️  Test Modu: ${
        TEST_MODE ? 'AÇIK (şifreler plain text)' : "KAPALI (şifreler hash'li)"
    }

📝 Test kullanıcıları:
   - username: admin, password: 123456
   - username: user, password: 123456

🔐 Endpoint'ler:
   - POST /register     → Yeni kullanıcı kaydı
   - POST /login        → Giriş yap ve token al
   - POST /token/refresh → Access token'ı yenile
   - POST /logout       → Çıkış yap
   - GET  /profile      → Kullanıcı profili (token gerekli)
   - GET  /protected    → Korumalı endpoint (token gerekli)
   - GET  /users        → Tüm kullanıcıları listele

📌 Token kullanımı:
   Header'a ekle: Authorization: Bearer YOUR_ACCESS_TOKEN

💡 Test için curl örneği:
   curl -X POST http://localhost:${PORT}/login \\
     -H "Content-Type: application/json" \\
     -d '{"username":"admin","password":"123456"}'
  `)
})
