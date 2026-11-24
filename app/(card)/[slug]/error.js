"use client";

export default function CardError({ reset }) {
  return (
    <main className="safe-x fill-dvh grid place-items-center py-10 text-center">
      <div>
        <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
        <p className="mt-2 text-mist">حاول مرة أخرى.</p>
        <button type="button" onClick={reset}
          className="tap glass-flat mt-5 rounded-control px-6 text-base font-medium text-accent2 hover:bg-white/[0.09] active:bg-white/[0.16]">
          إعادة المحاولة
        </button>
      </div>
    </main>
  );
}
