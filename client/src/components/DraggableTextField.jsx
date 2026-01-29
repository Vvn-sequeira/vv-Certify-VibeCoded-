import Draggable from 'react-draggable';
import { useRef, useState, useEffect } from 'react';

function DraggableTextField({ field, value, isSelected, disabled, onClick, onMove, scale = 1 }) {
    const nodeRef = useRef(null);
    const [currentPosition, setCurrentPosition] = useState(field.position || { x: 0, y: 0 });
    const isDragging = useRef(false);

    // Sync local state with prop changes (external updates)
    // Only update if we are NOT currently dragging to avoid fighting
    useEffect(() => {
        if (!isDragging.current && field.position) {
            setCurrentPosition(field.position);
        }
    }, [field.position]);

    // Update local state during drag (fast)
    const handleDrag = (e, data) => {
        isDragging.current = true;
        setCurrentPosition({ x: data.x, y: data.y });
    };

    // Commit to parent state on stop (avoids heavy re-renders)
    const handleStop = (e, data) => {
        isDragging.current = false;
        onMove({ x: data.x, y: data.y });
    };

    const textStyle = {
        fontFamily: field.style.fontFamily,
        fontSize: `${field.style.fontSize}px`,
        fontWeight: field.style.fontWeight,
        fontStyle: field.style.fontStyle,
        color: field.style.color,
        textAlign: field.style.textAlign,
        textTransform: field.style.textTransform,
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            position={currentPosition}
            onDrag={handleDrag}
            onStop={handleStop}
            disabled={disabled}
            bounds="parent"
            scale={scale} // CRITICAL: Fixes "tight" dragging on mobile/scaled canvas
        >
            <div
                ref={nodeRef}
                className={`draggable-text-field ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                style={{
                    cursor: disabled ? 'default' : 'move',
                }}
            >
                <div className="text-field-content" style={textStyle}>
                    {value}
                </div>
                {isSelected && !disabled && (
                    <div className="field-controls">
                        <div className="field-label">{field.label}</div>
                    </div>
                )}
            </div>
        </Draggable>
    );
}

export default DraggableTextField;
