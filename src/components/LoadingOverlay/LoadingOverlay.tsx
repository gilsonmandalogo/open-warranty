import { Loading } from 'components/Loading';
import React from 'react';
import styles from './LoadingOverlay.module.scss';

interface LoadingOverlayProps {
  children: React.ReactNode;
}

export const LoadingOverlay = ({ children }: LoadingOverlayProps) => (
  <>
    <div className={styles.overlay}>
      {children}
    </div>
    <div className={styles.loading}>
      <Loading/>
    </div>
  </>
);
