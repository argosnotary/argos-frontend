import { useState } from "react";

const useShrinkToggle = (): [boolean, (shrink: boolean) => void] => {
  const [shrink, setShrinkState] = useState(false);

  return [shrink, setShrinkState];
};

export default useShrinkToggle;
