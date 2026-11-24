/**
 * NutriTrack лого - лесно за повторна употреба низ апликацијата.
 * Иконата е чинија поделена во три сегменти во боите на
 * макронутриентите од Dashboard-от (протеини/јаглехидрати/масти) -
 * намерна врска со главната функција на апликацијата.
 */
export default function Logo({ size = 36, showText = true, textSize = 'text-lg' }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="22" fill="#FAFAF5" />
          <path d="M32 32 L32 10 A22 22 0 0 1 51 22 Z" fill="#5DCAA5" />
          <path d="M32 32 L51 22 A22 22 0 0 1 43 49 Z" fill="#F5A742" />
          <path d="M32 32 L43 49 A22 22 0 0 1 32 54 A22 22 0 0 1 21 49 Z" fill="#E85D5D" />
          <circle cx="32" cy="32" r="5" fill="#FAFAF5" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${textSize} tracking-tight`}>
          <span className="text-gray-900">Nutri</span>
          <span className="text-primary-600">Track</span>
        </span>
      )}
    </div>
  )
}
