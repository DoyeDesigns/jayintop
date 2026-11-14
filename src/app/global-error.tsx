"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body className="bg-[#1C1C1C] text-white">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
          <h1 className="text-[32px] uppercase">Content unavailable</h1>
          <p className="mt-4 text-[16px] leading-[24px] text-[#94979C]">
            The site could not load live content from Firebase.
          </p>
          <p className="mt-2 text-[14px] leading-[20px] text-[#94979C]">{error.message}</p>
        </main>
      </body>
    </html>
  );
}
