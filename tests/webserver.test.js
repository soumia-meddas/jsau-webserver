
const request = require('supertest')
const {app, server, repositoryPath} = require('../src/webserver')
const fs = require('fs').promises
const path = require('path')
afterAll(() => {
    server.close()
})

describe('Application API Tests', () => {
    const testHtmlFile = 'testfile.html'
    const testFavoritesFile = path.join(repositoryPath, 'json', 'data.json')

    beforeAll(async() => {

        await fs.writeFile(path.join(repositoryPath, 'html', testHtmlFile), '<h1>Test File</h1>', 'utf-8')
        await fs.writeFile(testFavoritesFile, JSON.stringify([], null, 2), 'utf-8')
    })

    afterAll(async() => {

        await fs.unlink(path.join(repositoryPath, 'html', testHtmlFile)).catch(() => {})
        await fs.unlink(testFavoritesFile).catch(() => {})
    })

    test('GET / - should render the home page', async() => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.text).toContain('Bienvenue sur JSAU Webserver')
    })

    test('GET /info - should render the info page', async() => {
        const res = await request(app).get('/info')
        expect(res.status).toBe(200)
        expect(res.text).toContain('jsau-webserver-1.0.0')
    })

    test('POST /favorites - should add a favorite file', async() => {
        const res = await request(app)
            .post('/favorites')
            .send(`filename=${testHtmlFile}`)
            .set('Content-Type', 'application/x-www-form-urlencoded')

        expect(res.status).toBe(200)
        expect(res.text).toContain(`Fichier ${testHtmlFile} ajouté aux favoris`)
    })

    test('DELETE /favorites/:id - should delete a favorite file', async() => {

        await request(app)
            .post('/favorites')
            .send(`filename=${testHtmlFile}`)
            .set('Content-Type', 'application/x-www-form-urlencoded')

        const favoritesData = JSON.parse(await fs.readFile(testFavoritesFile, 'utf-8'))
        const favoriteId = favoritesData.length > 0 ? favoritesData[0].id : undefined

        const res = await request(app).delete(`/favorites/${favoriteId}`)
        expect(res.status).toBe(200)
        expect(res.text).toContain(`Favori avec ID ${favoriteId} supprimé`)
    })

    test('GET /search - should return a file if it exists', async() => {
        const res = await request(app).get('/search?text=testfile')
        expect(res.status).toBe(200)
        expect(res.text).toContain('<h1>Test File</h1>')
    })
    test('GET /info - should include Cache-Control headers', async() => {
        const res = await request(app).get('/info')
        expect(res.header['cache-control']).toBe('no-store')
        expect(res.header['pragma']).toBe('no-cache')
        expect(res.header['expires']).toBe('0')
    })

    test('GET /documents/:filename - should download a file', async() => {
        const res = await request(app).get(`/documents/${testHtmlFile}`)
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toBe('text/html; charset=utf-8')
    })

})