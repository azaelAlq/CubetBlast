import { createContext } from "react";

export const BucketContext = createContext();

export const BucketProvider = ({ children }) => {
  const yo = "hola mundo";

  return (
    <BucketContext.Provider value={{ yo }}>{children}</BucketContext.Provider>
  );
};
