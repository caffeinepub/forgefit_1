export default function NeonLoader({
  size = "md",
}: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  return (
    <div className={`${sizeMap[size]} relative`}>
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: "#00d4ff",
          borderRightColor: "rgba(0,212,255,0.3)",
          filter: "drop-shadow(0 0 6px #00d4ff)",
        }}
      />
    </div>
  );
}
