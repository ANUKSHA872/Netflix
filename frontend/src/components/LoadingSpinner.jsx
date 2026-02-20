export default function LoadingSpinner({ fullScreen }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-20'}`}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-netflix-gray rounded-full animate-spin border-t-netflix-red" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full border-t-netflix-red animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
    </div>
  );
}
