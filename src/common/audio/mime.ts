import { AudioMime } from '../types'

const codecMimeMatches = {
  opus: 'audio/ogg',
  flac: 'audio/flac',
  wav: 'audio/wav',
  aac: 'audio/mp4',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4'
}

export const codecToMime = function (audioCodec: string): AudioMime | null {
  const codec = audioCodec.toLowerCase()
  if (codecMimeMatches[codec] === undefined) {
    return null
  }
  return codecMimeMatches[codec]
}
