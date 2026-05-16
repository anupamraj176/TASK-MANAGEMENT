import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#E2E4ED] max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-coral/10 text-coral rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-[#1A1A2E] mb-2">404</h1>
        <h2 className="text-xl font-medium text-[#1A1A2E] mb-4">Page not found</h2>
        <p className="text-[#8B8FA8] mb-8 text-sm">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-iris text-white font-medium hover:bg-iris/90 transition-colors shadow-soft"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
