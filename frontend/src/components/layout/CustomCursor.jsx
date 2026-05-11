import { useMousePosition } from '../../hooks/useMousePosition';

export default function CustomCursor() {
  const { x, y } = useMousePosition();

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      {/* Spotlight */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{
          left: x - 250,
          top: y - 250,
          background: 'radial-gradient(circle, #00d4ff, transparent 70%)',
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />
    </div>
  );
}
