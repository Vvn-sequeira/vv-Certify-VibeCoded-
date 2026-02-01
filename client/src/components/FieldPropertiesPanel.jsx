import { ChromePicker } from 'react-color';
import { useState } from 'react';

function FieldPropertiesPanel({ field, csvColumns, onUpdateField, onDeleteField }) {
    const [showColorPicker, setShowColorPicker] = useState(false);

    const fonts = [
        'Arial',
        'Times New Roman',
        'Georgia',
        'Verdana',
        'Courier New',
        'Playfair Display',
        'Crimson Text',
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Poppins',
        'Oswald',
        'Raleway',
        'Merriweather',
        'Lora',
        'Inter',
        'Dancing Script',
        'Great Vibes',
        'Pinyon Script',
        'Cinzel',
        'Alex Brush'
    ];

    return (
        <div className="field-properties-panel">
            <div className="panel-header">
                <h3>Field Properties</h3>
                <button className="btn-delete" onClick={onDeleteField} title="Delete Field">
                    🗑️
                </button>
            </div>

            <div className="panel-content">
                {/* Field Label */}
                <div className="form-group">
                    <label>Field Label</label>
                    <input
                        type="text"
                        value={field.label}
                        onChange={(e) => onUpdateField({ label: e.target.value })}
                        placeholder="e.g., Student Name"
                    />
                </div>

                {/* CSV Column Mapping */}
                <div className="form-group">
                    <label>Data Source</label>
                    <select
                        value={field.csvColumn || ''}
                        onChange={(e) => onUpdateField({
                            csvColumn: e.target.value || null,
                            staticValue: e.target.value ? '' : field.staticValue
                        })}
                    >
                        <option value="">Static Text</option>
                        {csvColumns.map(col => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                </div>

                {/* Static Value (if no CSV column selected) */}
                {!field.csvColumn && (
                    <div className="form-group">
                        <label>Static Text</label>
                        <input
                            type="text"
                            value={field.staticValue}
                            onChange={(e) => onUpdateField({ staticValue: e.target.value })}
                            placeholder="Enter text..."
                        />
                    </div>
                )}

                <div className="divider"></div>

                {/* Font Family */}
                <div className="form-group">
                    <label>Font Family & Style</label>
                    <select
                        value={`${field.style.fontFamily}|${field.style.fontStyle}`}
                        onChange={(e) => {
                            const [family, style] = e.target.value.split('|');
                            onUpdateField({
                                style: {
                                    ...field.style,
                                    fontFamily: family,
                                    fontStyle: style
                                }
                            });
                        }}
                    >
                        {fonts.map(font => (
                            <>
                                <option key={`${font}|normal`} value={`${font}|normal`} style={{ fontFamily: font, fontStyle: 'normal' }}>
                                    {font}
                                </option>
                                <option key={`${font}|italic`} value={`${font}|italic`} style={{ fontFamily: font, fontStyle: 'italic' }}>
                                    {font} (Italic)
                                </option>
                            </>
                        ))}
                    </select>
                </div>

                {/* Font Size */}
                <div className="form-group">
                    <label>Font Size: {field.style.fontSize}px</label>
                    <input
                        type="range"
                        min="12"
                        max="72"
                        value={field.style.fontSize}
                        onChange={(e) => onUpdateField({
                            style: { ...field.style, fontSize: parseInt(e.target.value) }
                        })}
                    />
                </div>

                {/* Font Weight */}
                <div className="form-group">
                    <label>Font Weight: {field.style.fontWeight}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="range"
                            min="100"
                            max="900"
                            step="100"
                            value={field.style.fontWeight === 'bold' ? 700 : field.style.fontWeight === 'normal' ? 400 : field.style.fontWeight}
                            onChange={(e) => onUpdateField({
                                style: { ...field.style, fontWeight: parseInt(e.target.value) }
                            })}
                            style={{ flex: 1 }}
                        />
                        <span style={{ minWidth: '30px', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>
                            {field.style.fontWeight}
                        </span>
                    </div>
                </div>



                {/* Text Color */}
                <div className="form-group">
                    <label>Text Color</label>
                    <div className="color-picker-wrapper">
                        <div
                            className="color-swatch"
                            style={{ backgroundColor: field.style.color }}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            {field.style.color}
                        </div>
                        {showColorPicker && (
                            <div className="color-picker-popover">
                                <div
                                    className="color-picker-cover"
                                    onClick={() => setShowColorPicker(false)}
                                />
                                <ChromePicker
                                    color={field.style.color}
                                    onChange={(color) => onUpdateField({
                                        style: { ...field.style, color: color.hex }
                                    })}
                                />
                            </div>
                        )}
                    </div>
                </div>



                {/* Text Transform */}
                <div className="form-group">
                    <label>Text Transform</label>
                    <select
                        value={field.style.textTransform}
                        onChange={(e) => onUpdateField({
                            style: { ...field.style, textTransform: e.target.value }
                        })}
                    >
                        <option value="none">None</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">Capitalize</option>
                    </select>
                </div>

                {/* Position Info */}
                <div className="divider"></div>
                <div className="position-info">
                    <small>Position: X: {Math.round(field.position.x)}px, Y: {Math.round(field.position.y)}px</small>
                </div>
            </div>
        </div>
    );
}

export default FieldPropertiesPanel;
