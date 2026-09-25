export function BrandMark() {
  return (
    <span className="brand" aria-label="ProofFactor">
      <span className="brand__mark" aria-hidden="true">
        <span className="brand__line brand__line--horizontal" />
        <span className="brand__line brand__line--vertical" />
        <span className="brand__node" />
      </span>
      <span className="brand__name">ProofFactor</span>
    </span>
  );
}
