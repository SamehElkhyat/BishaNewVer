'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from '../styles/Map.module.css';

interface Props {
  children: ReactNode;
  onError?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Map Error Boundary caught an error:', error, errorInfo);
    
    // Call the error handler if provided
    if (this.props.onError) {
      this.props.onError();
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    
    // Call the error handler to remount the map
    if (this.props.onError) {
      this.props.onError();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.mapError}>
          <div className={styles.mapErrorContent}>
            <h3>خطأ في تحميل الخريطة</h3>
            <p>حدث خطأ أثناء تحميل الخريطة التفاعلية</p>
            <button 
              onClick={this.handleRetry}
              className={styles.mapRetryButton}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
