interface PaddockLogoProps {
  className?: string
  title?: string
}

/**
 * Paddock brand mark — a simplified color-block paddock: cream sky, brass sun,
 * two-tone turf field, and a white post-and-rail fence. Fixed brand colors
 * (does not invert with theme) so the mark stays consistent.
 */
const PaddockLogo: React.FC<PaddockLogoProps> = ({
  className = '',
  title = 'Paddock',
}) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    role="img"
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="paddock-round">
        <rect width="48" height="48" rx="11" />
      </clipPath>
    </defs>
    <g clipPath="url(#paddock-round)">
      {/* sky */}
      <rect width="48" height="48" fill="#F3EFE4" />
      {/* sun */}
      <circle cx="35.5" cy="13" r="6.5" fill="#C8A45A" />
      {/* field — two color blocks for depth */}
      <rect y="26" width="48" height="22" fill="#4F9069" />
      <rect y="34" width="48" height="14" fill="#1E6B43" />
      {/* white post-and-rail fence on the horizon */}
      <g fill="#F7F4EC">
        <rect x="4" y="23.4" width="40" height="2.3" rx="1.1" />
        <rect x="4" y="28" width="40" height="2.3" rx="1.1" />
        <rect x="8" y="20.5" width="2.6" height="12.5" rx="1.3" />
        <rect x="22.7" y="20.5" width="2.6" height="12.5" rx="1.3" />
        <rect x="37.4" y="20.5" width="2.6" height="12.5" rx="1.3" />
      </g>
    </g>
  </svg>
)

export default PaddockLogo
