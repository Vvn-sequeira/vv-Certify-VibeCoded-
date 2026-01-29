const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORTS = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/api/generate', upload.any(), async (req, res) => {
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const csvFile = req.files.find(f => f.fieldname === 'file');
    const templateFile = req.files.find(f => f.fieldname === 'template');

    if (!csvFile) {
        return res.status(400).send('No CSV file uploaded (field name "file" required).');
    }

    if (!templateFile) {
        return res.status(400).send('No HTML template file uploaded (field name "template" required).');
    }

    // Read the uploaded HTML template
    let rawTemplate = '';
    try {
        rawTemplate = fs.readFileSync(templateFile.path, 'utf8');
        // Clean up template file after reading
        fs.unlinkSync(templateFile.path);
    } catch (e) {
        console.error('Error reading template file:', e);
        return res.status(400).send('Invalid HTML template file.');
    }

    const csvFilePath = csvFile.path;
    const results = [];

    let browser = null;

    try {
        // Parse CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        if (results.length === 0) {
            fs.unlinkSync(csvFilePath);
            return res.status(400).send('CSV file is empty.');
        }

        // Launch Puppeteer
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Setup Archive
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.attachment('certificates.zip');
        archive.pipe(res);

        const page = await browser.newPage();

        // Iterate rows and generate PDFs
        for (let i = 0; i < results.length; i++) {
            const row = results[i];
            let html = rawTemplate;

            // Replace dynamic placeholders {{Key}} with Value
            for (const [key, value] of Object.entries(row)) {
                
                // Safety check: avoid catastrophic backtracking or weird keys
                if(!key || key.length > 50) continue; 

                const regex = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(regex, value);
            }

            // Set content with a safer timeout and wait condition
            try {
                // Using 'domcontentloaded' is much faster and stable for static local HTML
                await page.setContent(html, { 
                    waitUntil: 'domcontentloaded',
                    timeout: 30000 
                });

                // Generate PDF
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    landscape: true,
                    printBackground: true
                });

                // Add to zip
                const fileName = row.Name ? `${row.Name.replace(/[^a-z0-9]/gi, '_')}.pdf` : `certificate_${i + 1}.pdf`;
                archive.append(Buffer.from(pdfBuffer), { name: fileName });

            } catch (pageError) {
                console.error(`Error generating page for row ${i}:`, pageError);
                // Continue to next row instead of failing everything? 
                // For now, let's log and keep going.
            }
        }

        await archive.finalize();
        fs.unlinkSync(csvFilePath);

    } catch (error) {
        console.error('Error generating certificates:', error);
        if (fs.existsSync(csvFilePath)) fs.unlinkSync(csvFilePath);
        
        if (!res.headersSent) {
            res.status(500).send('Error generating certificates');
        }
    } finally {
        if (browser) await browser.close();
    }
});

// New endpoint for visual certificate designer
app.post('/api/generate-visual', upload.any(), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const certificateImageFile = req.files.find(f => f.fieldname === 'certificateImage');
    const csvFile = req.files.find(f => f.fieldname === 'csvFile');

    if (!certificateImageFile) {
        return res.status(400).send('No certificate image uploaded.');
    }

    if (!csvFile) {
        return res.status(400).send('No CSV file uploaded.');
    }

    // Parse design config
    let designConfig;
    try {
        designConfig = JSON.parse(req.body.designConfig);
    } catch (e) {
        return res.status(400).send('Invalid design configuration.');
    }

    const { fields, imageDimensions } = designConfig;

    // Convert certificate image to base64
    let imageBase64;
    try {
        const imageBuffer = fs.readFileSync(certificateImageFile.path);
        imageBase64 = imageBuffer.toString('base64');
        const mimeType = certificateImageFile.mimetype || 'image/png';
        imageBase64 = `data:${mimeType};base64,${imageBase64}`;
        fs.unlinkSync(certificateImageFile.path);
    } catch (e) {
        console.error('Error reading certificate image:', e);
        return res.status(400).send('Invalid certificate image.');
    }

    const csvFilePath = csvFile.path;
    const results = [];
    let browser = null;

    try {
        // Parse CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        if (results.length === 0) {
            fs.unlinkSync(csvFilePath);
            return res.status(400).send('CSV file is empty.');
        }

        // Launch Puppeteer
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Setup Archive
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.attachment('certificates.zip');
        archive.pipe(res);

        const page = await browser.newPage();

        // Generate certificates for each row
        for (let i = 0; i < results.length; i++) {
            const row = results[i];

            // Generate HTML for this certificate
            const html = generateCertificateHTML(imageBase64, imageDimensions, fields, row);

            try {
                await page.setContent(html, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });

                // Generate PDF
                const pdfBuffer = await page.pdf({
                    width: `${imageDimensions.width}px`,
                    height: `${imageDimensions.height}px`,
                    printBackground: true
                });

                // Add to zip
                const fileName = row.Name ? `${row.Name.replace(/[^a-z0-9]/gi, '_')}.pdf` : `certificate_${i + 1}.pdf`;
                archive.append(Buffer.from(pdfBuffer), { name: fileName });

            } catch (pageError) {
                console.error(`Error generating page for row ${i}:`, pageError);
            }
        }

        await archive.finalize();
        fs.unlinkSync(csvFilePath);

    } catch (error) {
        console.error('Error generating certificates:', error);
        if (fs.existsSync(csvFilePath)) fs.unlinkSync(csvFilePath);

        if (!res.headersSent) {
            res.status(500).send('Error generating certificates');
        }
    } finally {
        if (browser) await browser.close();
    }
});

// Helper function to generate HTML for certificate
function generateCertificateHTML(imageBase64, imageDimensions, fields, rowData) {
    let fieldsHTML = '';

    fields.forEach(field => {
        // Get value from CSV or use static value
        let value = '';
        if (field.csvColumn && rowData[field.csvColumn]) {
            value = rowData[field.csvColumn];
        } else if (field.staticValue) {
            value = field.staticValue;
        } else {
            value = field.label;
        }

        const style = `
            position: absolute;
            left: ${field.position.x}px;
            top: ${field.position.y}px;
            font-family: ${field.style.fontFamily};
            font-size: ${field.style.fontSize}px;
            font-weight: ${field.style.fontWeight};
            font-style: ${field.style.fontStyle};
            color: ${field.style.color};
            text-align: ${field.style.textAlign};
            text-transform: ${field.style.textTransform};
            white-space: nowrap;
        `;

        fieldsHTML += `<div style="${style}">${value}</div>\n`;
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    margin: 0;
                    padding: 0;
                }
                .certificate-container {
                    position: relative;
                    width: ${imageDimensions.width}px;
                    height: ${imageDimensions.height}px;
                }
                .certificate-bg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            </style>
        </head>
        <body>
            <div class="certificate-container">
                <img src="${imageBase64}" class="certificate-bg" />
                ${fieldsHTML}
            </div>
        </body>
        </html>
    `;
}

app.listen(PORTS, () => {
    console.log(`Server running on http://localhost:${PORTS}`);
});
