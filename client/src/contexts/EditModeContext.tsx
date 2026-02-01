import React, { createContext, useContext, useState, useEffect } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_logged_in') === 'true';
    }
    return false;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_logged_in') === 'true';
    }
    return false;
  });

  // 当isEditMode改变时，同步到localStorage
  useEffect(() => {
    if (isEditMode) {
      localStorage.setItem('admin_logged_in', 'true');
    } else {
      localStorage.removeItem('admin_logged_in');
    }
  }, [isEditMode]);

  return (
    <EditModeContext.Provider value={{ isEditMode, setIsEditMode, isAdmin, setIsAdmin }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
}
