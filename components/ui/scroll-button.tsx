"use client";

import { Button } from "./button";

export function ScrollButton({ target }: { target: string }) {
  function handleClick() {
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <Button
      onClick={handleClick}
      className="text-[17px] cursor-pointer text-white"
    >
      {target}
    </Button>
  );
}
