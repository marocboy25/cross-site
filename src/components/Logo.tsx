type LogoProps = {
  /** Show the app's "P2P exchange" tag next to the wordmark. */
  tag?: boolean
  className?: string
}

/** Same lockup as the app header: mark, "Cross", optional mono tag. */
export function Logo({ tag = false, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src={`${import.meta.env.BASE_URL}brand/cross-logo-96.png`} alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-full" />
      <span className="display text-[19px]">Cross</span>
      {tag && <span className="eyebrow ml-1 hidden text-[10px] sm:inline">P2P exchange</span>}
    </span>
  )
}
