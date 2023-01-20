import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  let [state, setState] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => {
      setState(value);
    }, delay);

    return () => {
      clearTimeout(t);
    };
  }, [value, delay]);

  return state;
}

export { useDebounce };
