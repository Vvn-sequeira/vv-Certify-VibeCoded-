import { useState } from 'react';

function ImageUploader({ onImageUpload }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
            onImageUpload(file);
        } else {
            alert('Please upload an image file (PNG, JPG, etc.)');
        }
    };

    return (
        <div className="image-uploader-container">
            <div
                className={`image-upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleChange}
                    hidden
                />
                <label htmlFor="imageInput" className="upload-label">
                    <div className="upload-content">
                        <span className="upload-icon">🖼️</span>
                        <h2>Upload Certificate Background</h2>
                        <p>Drag & drop your certificate template image here</p>
                        <p className="upload-hint">or click to browse</p>
                        <div className="upload-formats">
                            Supports: PNG, JPG, JPEG
                        </div>
                        <div className="upload-recommendation">
                            💡 Recommended size: 1056x816px (A4 Landscape)
                        </div>
                    </div>
                </label>
            </div>

            <div className="upload-instructions">
                <h3>Getting Started:</h3>
                <ol>
                    <li>Upload your certificate background/template image</li>
                    <li>Click on the image to add text fields</li>
                    <li>Drag fields to position them</li>
                    <li>Configure field properties (font, size, color)</li>
                    <li>Upload CSV with student data</li>
                    <li>Generate certificates!</li>
                </ol>
            </div>
        </div>
    );
}

export default ImageUploader;
