import { useState } from 'react';
import ImageUploader from './ImageUploader';
import DesignCanvas from './DesignCanvas';
import FieldPropertiesPanel from './FieldPropertiesPanel';
import FieldListSidebar from './FieldListSidebar';
import CSVUploader from './CSVUploader';
import '../styles/CertificateDesigner.css';

function CertificateDesigner() {
    // Certificate Image State
    const [certificateImage, setCertificateImage] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 1056, height: 816 });

    // Fields State
    const [fields, setFields] = useState([]);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [nextFieldId, setNextFieldId] = useState(1);

    // CSV State
    const [csvFile, setCsvFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [csvColumns, setCsvColumns] = useState([]);

    // UI State
    const [previewMode, setPreviewMode] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

    // Handle image upload
    const handleImageUpload = (file) => {
        setCertificateImage(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImageDimensions({ width: img.width, height: img.height });
                setImageDataUrl(e.target.result);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Add new text field
    const addTextField = (position) => {
        try {
            console.log('Adding text field at position:', position);

            // Alert user to upload CSV first if this is the first field and no CSV is present
            if (fields.length === 0 && !csvFile) {
                alert("💡 Suggestion: Upload a CSV file first!\n\nThis will allow you to generate certificates for multiple students automatically.\n\nClick OK to continue with a manual text field.");
            }

            // Ensure position has valid coordinates
            // If no position provided, center it on the image
            const validPosition = position && typeof position.x === 'number' && typeof position.y === 'number'
                ? position
                : {
                    x: Math.max(0, (imageDimensions.width / 2) - 100), // Center width (approx text width offset)
                    y: Math.max(0, (imageDimensions.height / 2) - 30)  // Center height
                };

            const newField = {
                id: `field-${nextFieldId}`,
                label: `Field ${nextFieldId}`,
                csvColumn: null,
                staticValue: '',
                position: validPosition,
                style: {
                    fontFamily: 'Arial',
                    fontSize: 55,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    color: '#000000',
                    textAlign: 'center',
                    textTransform: 'none',
                }
            };

            console.log('New field created:', newField);
            setFields([...fields, newField]);
            setSelectedFieldId(newField.id);
            setIsPanelCollapsed(false); // Open right panel

            // On small screens, close left panel when adding a field (which opens right panel)
            if (window.innerWidth <= 1205) {
                setIsLeftPanelCollapsed(true);
            }

            setNextFieldId(nextFieldId + 1);
        } catch (error) {
            console.error('Error adding text field:', error);
            setStatus(`Error adding field: ${error.message}`);
        }
    };

    // Update field
    const updateField = (fieldId, updates) => {
        setFields(fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
        ));
    };

    // Delete field
    const deleteField = (fieldId) => {
        setFields(fields.filter(field => field.id !== fieldId));
        if (selectedFieldId === fieldId) {
            setSelectedFieldId(null);
            setIsPanelCollapsed(true); // Auto close panel
        }
    };

    // Handle CSV upload
    const handleCSVUpload = (file, data, columns) => {
        setCsvFile(file);
        setCsvData(data);
        setCsvColumns(columns);
    };

    // Generate certificates
    const generateCertificates = async () => {
        if (!certificateImage) {
            setStatus('Please upload a certificate background image.');
            return;
        }

        if (fields.length === 0) {
            setStatus('Please add at least one text field.');
            return;
        }

        if (!csvFile || csvData.length === 0) {
            setStatus('Please upload a CSV file with data.');
            return;
        }

        setLoading(true);
        setStatus('Generating certificates...');

        const formData = new FormData();
        formData.append('certificateImage', certificateImage);
        formData.append('designConfig', JSON.stringify({
            fields,
            imageDimensions
        }));
        formData.append('csvFile', csvFile);

        try {
            const response = await fetch('http://localhost:3000/api/generate-visual', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'certificates.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            setStatus('Success! Certificates downloaded.');
        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);

    // Helper to handle responsive sidebar toggling
    const handleDualSidebar = (sideToOpen) => {
        const isSmallScreen = window.innerWidth <= 1205;

        if (sideToOpen === 'left') {
            const willOpen = isLeftPanelCollapsed; // Currently collapsed = will open
            setIsLeftPanelCollapsed(!isLeftPanelCollapsed);

            if (willOpen && isSmallScreen) {
                setIsPanelCollapsed(true); // Close right panel
            }
        } else if (sideToOpen === 'right') {
            const willOpen = isPanelCollapsed;
            setIsPanelCollapsed(!isPanelCollapsed);

            if (willOpen && isSmallScreen) {
                setIsLeftPanelCollapsed(true); // Close left panel
            }
        }
    };

    // Field click handler
    const handleFieldClick = (fieldId) => {
        setSelectedFieldId(fieldId);
        setIsPanelCollapsed(false); // Auto-open right panel
        setPreviewMode(false); // Switch to edit mode

        // On small screens, close left panel when selecting a field (which opens right panel)
        if (window.innerWidth <= 1205) {
            setIsLeftPanelCollapsed(true);
        }
    };

    return (
        <div className="certificate-designer">
            <header className="designer-header">
                <div className="logo">🎓 vv-Certify</div>
                <div className="author-tagline">vibe-coded by : Vivian Marcel Sequeria</div>
            </header>

            <div className={`designer-container ${isPanelCollapsed || !selectedField ? 'panel-collapsed' : ''} ${isLeftPanelCollapsed ? 'left-panel-collapsed' : ''}`}>
                {/* Left Sidebar - Field List & CSV */}
                {/* Left Sidebar - Field List Only */}
                <button
                    className="panel-toggle-btn left-toggle"
                    onClick={() => handleDualSidebar('left')}
                    title={isLeftPanelCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                >
                    {isLeftPanelCollapsed ? '▶' : '◀'}
                </button>
                <div className="left-sidebar-wrapper">
                    <div className="left-sidebar-content">
                        <FieldListSidebar
                            fields={fields}
                            selectedFieldId={selectedFieldId}
                            onSelectField={handleFieldClick}
                            onDeleteField={deleteField}
                            onAddField={() => addTextField()}
                        />
                    </div>
                </div>

                {/* Center - Canvas */}
                <div className="designer-main" style={{ position: 'relative' }}>
                    {!imageDataUrl ? (
                        <ImageUploader onImageUpload={handleImageUpload} />
                    ) : (
                        <>
                            <DesignCanvas
                                imageDataUrl={imageDataUrl}
                                imageDimensions={imageDimensions}
                                fields={fields}
                                selectedFieldId={selectedFieldId}
                                csvData={csvData}
                                previewMode={previewMode}
                                previewIndex={previewIndex}
                                onFieldClick={handleFieldClick}
                                onFieldMove={(fieldId, position) => updateField(fieldId, { position })}
                                onCanvasClick={addTextField}
                            />

                            <div className="designer-actions">
                                <CSVUploader onCSVUpload={handleCSVUpload} csvColumns={csvColumns} />

                                {csvData.length > 0 && (
                                    <div className="preview-controls">
                                        <button
                                            className="btn-secondary"
                                            onClick={() => setPreviewMode(!previewMode)}
                                        >
                                            {previewMode ? '✏️ Edit Mode' : '👁️ Preview Mode'}
                                        </button>

                                        {previewMode && (
                                            <div className="preview-navigation">
                                                <button
                                                    onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                                                    disabled={previewIndex === 0}
                                                >
                                                    ◀ Previous
                                                </button>
                                                <span>{previewIndex + 1} / {csvData.length}</span>
                                                <button
                                                    onClick={() => setPreviewIndex(Math.min(csvData.length - 1, previewIndex + 1))}
                                                    disabled={previewIndex === csvData.length - 1}
                                                >
                                                    Next ▶
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    className="btn-primary btn-generate"
                                    onClick={generateCertificates}
                                    disabled={loading || !csvFile || fields.length === 0}
                                >
                                    {loading ? 'Generating...' : '🎓 Generate All Certificates'}
                                </button>

                                {status && (
                                    <div className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>
                                        {status}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Sidebar - Properties Panel */}
                {selectedField && (
                    <>
                        <button
                            className="panel-toggle-btn"
                            onClick={() => handleDualSidebar('right')}
                            title={isPanelCollapsed ? "Show Properties" : "Hide Properties"}
                        >
                            {isPanelCollapsed ? '◀' : '▶'}
                        </button>
                        <div className="properties-panel-wrapper">
                            <FieldPropertiesPanel
                                field={selectedField}
                                csvColumns={csvColumns}
                                onUpdateField={(updates) => updateField(selectedField.id, updates)}
                                onDeleteField={() => deleteField(selectedField.id)}
                            />
                        </div>
                    </>
                )}
            </div>

            <footer className="designer-footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <h3>How It Works</h3>
                        <ol>
                            <li>Upload your certificate background image</li>
                            <li>Click to add & drag text fields</li>
                            <li>Configure fonts, colors & styles</li>
                            <li>Upload CSV with student data</li>
                            <li>Generate & download certificates!</li>
                        </ol>
                    </div>
                    <div className="footer-right">
                        <h3>Connect With Me</h3>
                        <div className="social-links">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="social-icon">💼</span> LinkedIn
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="social-icon">📸</span> Instagram
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="social-icon">💻</span> GitHub
                            </a>
                        </div>
                        <p className="footer-tagline">100% Free • Private • Local Processing</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default CertificateDesigner;

