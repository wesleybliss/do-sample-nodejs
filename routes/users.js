const express = require('express')
const router = express.Router()
const { Poppler } = require('node-poppler')
const os = require('os')
const fsp = require('fs/promises')
const path = require('path')

const root = path.resolve(__dirname, '../public')
const file = path.resolve(root, '100-337.pdf')
const popplerBinDir = ''

const getOutputFilePath = filename => path.join(filename + '.png')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource')
})

router.get('/pdf', async (req, res) => {
    
    const dir = path.dirname(file)
    const name = getOutputFilePath(file)
    const fileName = path.basename(file)
    const poppler = new Poppler(popplerBinDir)
    
    const options = {
        /* firstPageToConvert: 1,
        lastPageToConvert: 2, */
        pngFile: true,
        forcePageNumber: true,
        hideAnnotations: true,
        resolutionXYAxis: 300,
        scalePageTo: 4096,
        separator: '-',
        antialiasFonts: 'yes',
        antialiasVectors: 'yes',
        
        // grayscaleFile: true, // @todo enable this after testing
    }
    
    await poppler.pdfToPpm(file, name, options)
    
    const files = await fsp.readdir(dir)
    
    const result = files
        .filter(it => it.startsWith(fileName) && it.endsWith('.png'))
        .map(it => path.resolve(dir, it))
        .sort((a, b) => {
            
            if (a > b) return 1
            if (a < b) return -1
            
            return 0
            
        })
    
    res.json({ files: result })
    
})

module.exports = router
