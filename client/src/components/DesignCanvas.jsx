import DraggableTextField from './DraggableTextField';
import { useState, useEffect, useRef } from 'react';

function DesignCanvas({
    imageDataUrl,
    imageDimensions,
    fields,
    selectedFieldId,
    csvData,
    previewMode,
    previewIndex,
    onFieldClick,
    onFieldMove,
    onCanvasClick
}) {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);

    // Calculate scale to fit canvas in viewport
    useEffect(() => {
        const calculateScale = () => {
            if (canvasRef.current) {
                const container = canvasRef.current.parentElement;
                const containerWidth = Math.max(300, container.clientWidth - 40); // padding safety
                const containerHeight = Math.max(300, window.innerHeight - 300); // ensure positive height

                const scaleX = containerWidth / imageDimensions.width;
                const scaleY = containerHeight / imageDimensions.height;
                const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

                setScale(Math.max(0.1, newScale)); // Minimum scale safety
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [imageDimensions]);

    const handleCanvasClick = (e) => {
        // Only add field if clicking on the canvas itself, not on a field
        if (e.target.classList.contains('design-canvas') || e.target.classList.contains('canvas-image')) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            onCanvasClick({ x, y });
        }
    };

    const getFieldValue = (field) => {
        if (previewMode && csvData.length > 0) {
            const rowData = csvData[previewIndex];
            if (field.csvColumn && rowData[field.csvColumn]) {
                return rowData[field.csvColumn];
            }
            return field.staticValue || field.label || 'Text Field';
        }

        // Edit mode
        if (field.csvColumn) {
            return `{{${field.csvColumn}}}`;
        }
        return field.staticValue || field.label || 'Text Field';
    };

    return (
        <div className="canvas-wrapper">
            <div className="canvas-toolbar">
                <div className="canvas-info">
                    <span>Canvas Size: {imageDimensions.width} × {imageDimensions.height}px</span>
                    <span>Scale: {Math.round(scale * 100)}%</span>
                    <span>Fields: {fields.length}</span>
                </div>
                {!previewMode && (
                    <div className="canvas-hint">
                        💡 Tip: Upload a CSV file first for dynamic fields, or click to add text
                    </div>
                )}
            </div>

            <div
                ref={canvasRef}
                className="design-canvas"
                onClick={previewMode ? undefined : handleCanvasClick}
                style={{
                    width: imageDimensions.width * scale,
                    height: imageDimensions.height * scale,
                    cursor: previewMode ? 'default' : 'crosshair',
                    transform: `scale(1)`,
                    transformOrigin: 'top left'
                }}
            >
                <img
                    src={imageDataUrl}
                    alt="Certificate Background"
                    className="canvas-image"
                    draggable={false}
                    style={{
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left'
                    }}
                />

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: imageDimensions.width,
                    height: imageDimensions.height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left'
                }}>
                    {fields.map(field => (
                        <DraggableTextField
                            key={field.id}
                            field={field}
                            value={getFieldValue(field)}
                            isSelected={field.id === selectedFieldId}
                            disabled={previewMode}
                            onClick={() => onFieldClick(field.id)}
                            onMove={(position) => onFieldMove(field.id, position)}
                            scale={scale}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DesignCanvas;
