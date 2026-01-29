import { useState } from 'react';
import Papa from 'papaparse';

function CSVUploader({ onCSVUpload, csvColumns }) {
    const [fileName, setFileName] = useState('');
    const [rowCount, setRowCount] = useState(0);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            alert('Please upload a CSV file');
            return;
        }

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const columns = results.meta.fields || [];
                const data = results.data;

                setRowCount(data.length);
                onCSVUpload(file, data, columns);
            },
            error: (error) => {
                console.error('CSV parsing error:', error);
                alert('Error parsing CSV file. Please check the format.');
            }
        });
    };

    return (
        <div className="csv-uploader">
            <div className="csv-upload-section">
                <label htmlFor="csvInput" className="csv-label">
                    {fileName ? (
                        <div className="csv-info">
                            <span className="csv-icon">📊</span>
                            <div className="csv-details">
                                <div className="csv-filename">{fileName}</div>
                                <div className="csv-stats">
                                    {rowCount} row{rowCount !== 1 ? 's' : ''} • {csvColumns.length} column{csvColumns.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <span className="csv-change">Change</span>
                        </div>
                    ) : (
                        <div className="csv-prompt">
                            <span className="csv-icon">📊</span>
                            <span>Upload CSV Data</span>
                        </div>
                    )}
                </label>
                <input
                    type="file"
                    id="csvInput"
                    accept=".csv"
                    onChange={handleFileChange}
                    hidden
                />
            </div>

            {csvColumns.length > 0 && (
                <div className="csv-columns">
                    <div className="columns-header">Detected Columns:</div>
                    <div className="columns-list">
                        {csvColumns.map(col => (
                            <span key={col} className="column-badge">{col}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CSVUploader;
