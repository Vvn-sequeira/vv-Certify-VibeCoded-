import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    borderRadius: '10px',
                    margin: '1rem'
                }}>
                    <h2>Something went wrong</h2>
                    <p>{this.state.error?.message || 'Unknown error'}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
