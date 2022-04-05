import { useEffect, useState } from "react";

export const useFetch = <T extends object>(url: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<T | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000" + url);
      const jsonResult: T = await response.json();
      // Just so it feels nicer :P
      await new Promise((r) => setTimeout(r, 500));
      setIsLoading(false);
      setResult(jsonResult);
    })();
  }, [url]);
  return { isLoading, result };
};
