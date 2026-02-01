import React, { createContext, useContext, useState } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
