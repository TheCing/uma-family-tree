import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { getImagePath, getUmaNameById } from '../../utils/formatting'

interface SavedUmaAvatarProps {
  umaId?: string
}

/**
 * Avatar for a saved Uma. Falls back to a Heart icon when there is no id or
 * the image fails to load — handled via React state rather than mutating the
 * DOM node directly.
 */
const SavedUmaAvatar: React.FC<SavedUmaAvatarProps> = ({ umaId }) => {
  const [hasError, setHasError] = useState(false)

  if (!umaId || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Heart className="w-6 h-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <img
      src={getImagePath(umaId)}
      alt={getUmaNameById(umaId)}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  )
}

export default SavedUmaAvatar
