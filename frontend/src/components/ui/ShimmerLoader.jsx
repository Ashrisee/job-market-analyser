export default function ShimmerLoader({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl bg-white/5 h-4" style={{ width: `${90 - i * 15}%` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function CardShimmer({ className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 space-y-4 ${className}`}>
      <div className="relative overflow-hidden rounded-lg bg-white/5 h-6 w-3/4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      <div className="relative overflow-hidden rounded-lg bg-white/5 h-4 w-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="relative overflow-hidden rounded-full bg-white/5 h-6 w-16">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
