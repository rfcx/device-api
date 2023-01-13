import ffmpeg from 'fluent-ffmpeg'
import { stat, unlink } from 'fs/promises'
import { AudioFormat, AudioTranscodeParams } from '../../types'

const audioFormatSettings = {
  mp3: {
    extension: 'mp3',
    codec: 'libmp3lame',
    outputFormat: 'mp3',
    mime: 'audio/mpeg',
    inputOptions: [],
    outputOptions: ['-b:a 32k'],
    maxValues: {
      sampleRate: 48000,
      maxOutputOptions: ['-b:a 96k']
    }
  },
  opus: {
    extension: 'opus',
    codec: 'libopus',
    outputFormat: 'opus',
    mime: 'audio/ogg',
    inputOptions: [],
    outputOptions: ['-b:a 16k', '-compression_level 9', '-application audio', '-vbr on'],
    maxValues: {
      sampleRate: 48000,
      maxOutputOptions: ['-b:a 48k', '-compression_level 9', '-application audio', '-vbr on']
    }
  },
  wav: {
    extension: 'wav',
    codec: 'pcm_s16le',
    outputFormat: 'wav',
    mime: 'audio/wav',
    inputOptions: ['-flags +bitexact'],
    outputOptions: [],
    maxValues: {
      sampleRate: 192000,
      maxOutputOptions: ['-flags +bitexact']
    }
  },
  flac: {
    extension: 'flac',
    codec: 'flac',
    outputFormat: 'flac',
    mime: 'audio/flac',
    inputOptions: [],
    outputOptions: ['-sample_fmt s16'],
    maxValues: {
      sampleRate: 192000,
      maxOutputOptions: ['-sample_fmt s16']
    }
  },
  m4a: {
    extension: 'm4a',
    codec: 'libfdk_aac',
    outputFormat: 'm4a',
    mime: 'audio/mp4',
    inputOptions: [],
    outputOptions: ['-b:a 16k'],
    maxValues: {
      sampleRate: 48000,
      maxOutputOptions: ['-b:a 48k']
    }
  }
}

export const getFfmpegOutputOptions = function (audioFormat: AudioFormat, params: AudioTranscodeParams, useMaxValues: boolean): string[] {
  return [
    ...((params.clipOffset !== undefined && params.clipOffset !== null) ? [`-ss ${params.clipOffset}`] : []),
    ...((params.clipDuration !== undefined && params.clipDuration != null) ? [`-t ${params.clipDuration}`] : []),
    ...(!!params.enhanced ? ['-filter_complex', '[0:a][1:a]amerge=inputs=2[aout]', '-map', '[aout]'] : []), // eslint-disable-line @typescript-eslint/strict-boolean-expressions, no-extra-boolean-cast
    ...(useMaxValues ? audioFormatSettings[audioFormat].maxValues.maxOutputOptions : audioFormatSettings[audioFormat].outputOptions)
  ]
}

export const transcodeToFile = async function (audioFormat: AudioFormat, params: AudioTranscodeParams): Promise<string> {
  await stat(params.sourceFilePath) // check if file exists
  const outputFilePath = `${params.sourceFilePath.split('.').slice(0, -1).join('.')}_.${audioFormat}`
  const copyCodecInsteadOfTranscode = params.copyCodecInsteadOfTranscode === true
  const ffmpegInputOptions = audioFormatSettings[audioFormat].inputOptions
  const useMaxValues = params.sampleRate !== undefined && params.sampleRate > (0.8 * audioFormatSettings[audioFormat].maxValues.sampleRate)
  if (useMaxValues) {
    params.sampleRate = audioFormatSettings[audioFormat].maxValues.sampleRate
  }
  const ffmpegOutputOptions = getFfmpegOutputOptions(audioFormat, params, useMaxValues)

  let cmd = ffmpeg(params.sourceFilePath) // eslint-disable-line new-cap
    .noVideo()
    .input(params.sourceFilePath)
    .inputOptions(ffmpegInputOptions)
    .outputOptions(ffmpegOutputOptions)
    .outputFormat(audioFormatSettings[audioFormat].outputFormat)
    .audioCodec((copyCodecInsteadOfTranscode) ? 'copy' : audioFormatSettings[audioFormat].codec)
    .audioChannels(params.enhanced === true ? 2 : 1)

  if (params.sampleRate !== undefined) {
    cmd = cmd.audioFrequency(params.sampleRate)
  }
  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(function () {
      cmd.kill('0')
      reject(Error('FFmpeg command killed by a timeout'))
    }, 120000)

    cmd.save(outputFilePath)
      .on('error', function (err: Error, stdout: string, stderr: string) {
        clearTimeout(timeout)
        console.error(`An error occurred: ${err.message}, stdout: ${stdout}, stderr: ${stderr}`)
        reject(err)
      })
      .on('end', async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
        clearTimeout(timeout)
        if (params.keepFile === false) {
          await unlink(params.sourceFilePath)
        }
        resolve(outputFilePath)
      })
  })
}
