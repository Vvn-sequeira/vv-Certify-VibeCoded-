function FieldListSidebar({ fields, selectedFieldId, onSelectField, onDeleteField, onAddField }) {
    return (
        <div className="field-list-sidebar">
            <div className="sidebar-header">
                <h3>Text Fields</h3>
                <button className="btn-add" onClick={onAddField} title="Add New Field">
                    ➕ Add Field
                </button>
            </div>

            <div className="field-list">
                {fields.length === 0 ? (
                    <div className="empty-state">
                        <p>No fields yet</p>
                        <small>Click on the canvas to add a field</small>
                    </div>
                ) : (
                    fields.map((field, index) => (
                        <div
                            key={field.id}
                            className={`field-item ${field.id === selectedFieldId ? 'selected' : ''}`}
                            onClick={() => onSelectField(field.id)}
                        >
                            <div className="field-item-content">
                                <div className="field-number">{index + 1}</div>
                                <div className="field-info">
                                    <div className="field-name">{field.label}</div>
                                    <div className="field-source">
                                        {field.csvColumn ? (
                                            <span className="csv-badge">📊 {field.csvColumn}</span>
                                        ) : (
                                            <span className="static-badge">📝 Static</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn-delete-small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteField(field.id);
                                }}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>

            {fields.length > 0 && (
                <div className="sidebar-footer">
                    <small>{fields.length} field{fields.length !== 1 ? 's' : ''} added</small>
                </div>
            )}
        </div>
    );
}

export default FieldListSidebar;
