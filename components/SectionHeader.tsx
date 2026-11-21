export function SectionHeader({ title, id }: { title: string; id: string }) {
  return (
    <header className="mb-8" data-board={`h-${id}`}>
      <h2 className="text-[18px] leading-7 text-muted">{title}</h2>
    </header>
  );
}
