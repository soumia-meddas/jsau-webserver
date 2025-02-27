
const express = require('express')
const app = express()
app.use(express.json())
const port = 8082
const fs = require('fs').promises
const path = require('path')
const {env} = require('node:process')
const morgan = require('morgan')
const methodOverride = require('method-override')
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    next()
})
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride((req, res) => {
    if (req.body && '_method' in req.body) {
        const method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(morgan('dev'))
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})
const repositoryPath = env.JSAU_REPOSITORY_FILE_PATH
if (!repositoryPath) {
    throw new Error('fichier invalid')
}

const fileHtml = path.join(repositoryPath, 'html')
const fileJson = path.join(repositoryPath, 'json')
const jsonPath = path.join(fileJson, 'data.json')

/* la fonction callBack */
app.use('/info', (req, res) => {
    const handleInfo = (callback) => {
        const appInfo = 'jsau-webserver-1.0.0'
        callback(null, appInfo)
    }
    handleInfo((err, appInfo) => {
        if (err) {
            res.render('error', {message: 'Erreur lors de la récupération des informations'})
        } else {
            res.render('info', {appInfo})
        }
    })
})
app.get('/', async(req, res) => {
    let favorites = []
    let downloadedFiles = []

    try {
        const data = await fs.readFile(jsonPath, 'utf-8')
        favorites = JSON.parse(data)
    } catch {
        favorites = []
    }

    try {
        const files = await fs.readdir(fileHtml)
        downloadedFiles = files.filter(file => file.endsWith('.html'))
    } catch {
        downloadedFiles = []
    }

    res.render('index', {
        message: 'Bienvenue sur JSAU Webserver',
        favorites,
        downloadedFiles,
    })
})

app.get('/info', (req, res) => {
    const handleInfo = (callback) => {
        const appInfo = 'jsau-webserver-1.0.0'
        callback(null, appInfo)
    }

    handleInfo((err, appInfo) => {
        if (err) {
            return res.sendStatus(500)
        }
        res.render('info', {appInfo})
    })
})

// async-promise-then
app.get('/search', (req, res) => {
    const query = req.query.text
    if (!query) {
        return res.render('error', {message: 'Requête invalide, paramètre manquant'})
    } else {
        const filepath = path.join(fileHtml, `${query}.html`)
        fs.access(filepath)
            .then(()=> {
                return res.sendFile(filepath)
            })
            .catch((err)=> {
                if (err.code == 'ENOENT') {
                    return res.render('error', {message: `Fichier ${query}.html introuvable`})
                } else {
                    return res.render('error', {message: 'Erreur interne du serveur'})
                }
            })
    }
})

//async-promise-async-await
app.get('/documents/:filename', async(req, res) => {
    const filename = req.query.filename

    if (!filename || !filename.endsWith('.html')) {
        return res.render('error', {message: 'Format de fichier non valide'})
    }
    const filepath = path.join(fileHtml, filename)
    try {
        await fs.access(filepath)
        return res.download(filepath, filename, (err) => {
            if (err) {
                return res.render('error', {message: 'Erreur lors du téléchargement'})
            }
        })
    } catch {
        return res.render('error', {message: `Fichier ${filename} introuvable`})
    }

})
//async-promise-async-await
app.post('/favorites', async(req, res) => {
    const filename = req.body.filename
    if (!filename || !filename.endsWith('.html')) {
        return res.render('error', {message: 'Format de fichier non valide'})
    }

    try {
        const filePath = path.join(fileHtml, filename)
        await fs.access(filePath)
    } catch {
        return res.render('error', {message: `Fichier ${filename} introuvable`})
    }

    let favorites = []
    try {
        const data = await fs.readFile(jsonPath, 'utf-8')
        favorites = JSON.parse(data)
    } catch {
        favorites = []
    }

    const alreadyExists = favorites.some(fav => fav.filename === filename)
    if (!alreadyExists) {
        favorites.push({id: favorites.length + 1, filename})
        await fs.writeFile(jsonPath, JSON.stringify(favorites, null, 2))
    }

    res.render('success', {
        message: alreadyExists
            ? `Fichier ${filename} déjà présent dans les favoris`
            : `Fichier ${filename} ajouté aux favoris`,
        favorites,
    })
})

//async-promise-async-await
app.delete('/favorites/:id', async(req, res) => {
    const id = parseInt(req.params.id, 10)

    try {
        const data = await fs.readFile(jsonPath, 'utf-8')
        const favorites = JSON.parse(data)

        const favoriteIndex = favorites.findIndex(fav => fav.id === id)
        if (favoriteIndex !== -1) {
            favorites.splice(favoriteIndex, 1)
            await fs.writeFile(jsonPath, JSON.stringify(favorites, null, 2), 'utf-8')
            return res.render('success', {message: `Favori avec ID ${id} supprimé`, favorites})
        } else {
            return res.render('error', {message: `Favori avec ID ${id} introuvable`})
        }
    } catch (error) {
        return res.render('error', {message: 'Erreur interne du serveur'})
    }
})

const server = app.listen(port, () => {
    console.log(`Example app listenting on port ${port}`)
})
module.exports = {app, server, repositoryPath}