// libs
import { createContext, useContext } from 'react';

// Modo de edição isolado por seção. Cada EditableSection provê seu próprio valor.
const SectionEditContext = createContext<boolean>(false);

export const SectionEditProvider = SectionEditContext.Provider;

export const useSectionEditing = (): boolean => {
  return useContext(SectionEditContext);
};
