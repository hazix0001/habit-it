type Props = {
  label: string;
  value: string;
};

export function PixelStatCard({ label, value }: Props) {
  return (
    <div className="border-[3px] border-[var(--color-ink)] bg-white p-3 text-center dark:border-black dark:bg-[#100e18]">
      <p className="font-pixel mb-2 text-[0.55rem] opacity-60">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}
