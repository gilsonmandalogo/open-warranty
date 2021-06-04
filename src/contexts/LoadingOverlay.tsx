import { LoadingOverlay } from 'components/LoadingOverlay';
import React from 'react';

interface LoadingOverlayContextType {
  setIsLoading: (value: boolean) => void;
}

const LoadingOverlayContext = React.createContext<LoadingOverlayContextType | null>(null);

interface LoadingOverlayProviderProps {
  children: React.ReactNode;
}

export function LoadingOverlayProvider({ children }: LoadingOverlayProviderProps) {
  const [ isLoading, setIsLoading ] = React.useState(false);

  const content = React.useMemo(() => {
    if (isLoading) {
      return (
        <LoadingOverlay>
          {children}
        </LoadingOverlay>
      );
    }

    return children;
  }, [isLoading, children]);

  return (
    <LoadingOverlayContext.Provider
      value={{ setIsLoading }}
    >
      {content}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlayContext() {
  return React.useContext(LoadingOverlayContext)!.setIsLoading;
}
