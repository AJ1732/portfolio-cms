"use client";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-2 px-6 py-10 md:gap-6">
      <h1 className="text-4xl md:text-7xl">NOT FOUND!</h1>
      <p className="text-xl md:text-4xl">
        I don&apos;t know how you got here, but go{" "}
        <button
          type="button"
          onClick={() => router.back()}
          className="font-medium text-orange-500"
        >
          back
        </button>
      </p>
    </div>
  );
};
export default NotFound;
