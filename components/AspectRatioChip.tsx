type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9' | '2:3';

interface Props {
  ratio: AspectRatio;
  size?: 'xs' | 'sm' | 'md';
  decorative?: boolean;
}

const DIMS: Record<string, { w: number; h: number }> = {
  '16:9': { w: 32, h: 18 },
  '9:16': { w: 16, h: 28 },
  '1:1': { w: 22, h: 22 },
  '4:3': { w: 28, h: 21 },
  '21:9': { w: 38, h: 16 },
  '2:3': { w: 16, h: 24 },
};

const SCALE: Record<string, number> = { xs: 0.75, sm: 1, md: 1.5 };

export function AspectRatioChip({ ratio, size = 'sm', decorative = false }: Props) {
  const base = DIMS[ratio] ?? { w: 22, h: 22 };
  const s = SCALE[size];

  return (
    <div className="flex flex-col items-center gap-[3px]">
      <div
        className="border border-ph-teal rounded-[1px] bg-transparent flex-shrink-0"
        style={{
          width: Math.round(base.w * s),
          height: Math.round(base.h * s),
        }}
      />
      {!decorative && (
        <span className="font-mono text-ph-teal leading-none" style={{ fontSize: size === 'xs' ? 8 : 9, letterSpacing: '0.04em' }}>
          {ratio}
        </span>
      )}
    </div>
  );
}
