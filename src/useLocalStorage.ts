import { useState } from "react";

type AnyJSONCompatible = string | number | boolean | null | object;

const serialize = (value: AnyJSONCompatible) => {
  return JSON.stringify(value);
};

const deserialize = (value: string) => {
  return JSON.parse(value);
};

export const useLocalStorage = <T extends AnyJSONCompatible>(
  key: string,
  defaultValue: T
) => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? deserialize(storedValue) : defaultValue;
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, serialize(newValue));
  };

  return [value, setStoredValue] as const;
};
