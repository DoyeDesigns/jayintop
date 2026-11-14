"use client";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col justify-center px-6 py-16">
      <h1 className="font-tanker text-[32px] uppercase text-brand-white">Content unavailable</h1>
      <p className="mt-4 font-inter text-[16px] leading-[24px] text-[#94979C]">
        The site could not load live content from Firebase.
      </p>
      <p className="mt-2 font-inter text-[14px] leading-[20px] text-[#94979C]">{error.message}</p>
    </main>
  );
}
