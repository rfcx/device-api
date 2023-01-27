import { ValidationError } from '@rfcx/http-utils'
import { muteConsole } from '../../common/db/testing'
import { splitBuffer } from './buffer'

beforeAll(() => {
  muteConsole()
})

describe('splitBuffer function', () => {
  describe('error cases', () => {
    test('should throw an eror if json buffer less is empty', () => {
      const buf = Buffer.from('')
      expect(() => splitBuffer(buf)).toThrow(ValidationError)
      expect(() => splitBuffer(buf)).toThrowError('Invalid mqtt message: buffer length')
    })
    test('should throw an eror if json buffer less is invalid', () => {
      const buf = Buffer.from('abc')
      expect(() => splitBuffer(buf)).toThrow(ValidationError)
      expect(() => splitBuffer(buf)).toThrowError('Invalid mqtt message: buffer length')
    })
  })
  describe('normal cases', () => {
    test('correct data when json is full, audio, screenshot, log are empty', () => {
      const buf = Buffer.from('000000000001a')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio).toBeNull()
      expect(splitted.screenshot).toBeNull()
      expect(splitted.log).toBeNull()
    })
    test('correct data when json is full, audio, screenshot, log are zero', () => {
      const buf = Buffer.from('000000000001a000000000000000000000000000000000000')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio?.toString('utf8')).toBe('')
      expect(splitted.screenshot?.toString('utf8')).toBe('')
      expect(splitted.log?.toString('utf8')).toBe('')
    })
    test('correct data when json, audio are full, screenshot, log are empty', () => {
      const buf = Buffer.from('000000000001a000000000002ab')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio?.toString('utf8')).toBe('ab')
      expect(splitted.screenshot).toBeNull()
      expect(splitted.log).toBeNull()
    })
    test('correct data when json, audio are full, screenshot, log are zero', () => {
      const buf = Buffer.from('000000000001a000000000002ab000000000000000000000000')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio?.toString('utf8')).toBe('ab')
      expect(splitted.screenshot?.toString('utf8')).toBe('')
      expect(splitted.log?.toString('utf8')).toBe('')
    })
    test('correct data when json, audio, screnshot are full, log is empty', () => {
      const buf = Buffer.from('000000000001a000000000002ab000000000003abc')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio?.toString('utf8')).toBe('ab')
      expect(splitted.screenshot?.toString('utf8')).toBe('abc')
      expect(splitted.log).toBeNull()
    })
    test('correct data when json, audio, screnshot are full, log is zero', () => {
      const buf = Buffer.from('000000000001a000000000002ab000000000003abc000000000000')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio?.toString('utf8')).toBe('ab')
      expect(splitted.screenshot?.toString('utf8')).toBe('abc')
      expect(splitted.log?.toString('utf8')).toBe('')
    })
    test('correct data when json, audio, screnshot, log are full', () => {
      const buf = Buffer.from('000000000001a000000000002ab000000000003abc000000000004abcd')
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe('a')
      expect(splitted.audio?.toString('utf8')).toBe('ab')
      expect(splitted.screenshot?.toString('utf8')).toBe('abc')
      expect(splitted.log?.toString('utf8')).toBe('abcd')
    })

    test('correct data when json, audio, screnshot, log are full and long', () => {
      const json = 'HMUY4m5j2H9zLNpd9uQLADKuKjKubaeLxdn2zmUr8A9XMuFDn9Cph5LeKQbEK6wPEsUeqBapaNG6ygMszf'
      const audio = 'fDpJAAds2fzvSDsM9WSU3BfFVzeJETMxXxq9QmUwvvhGx7ZccVSqtx9RpL5M7jPTQGXPYndPxKuELBWQzCEySQExCzJrAmeZeZu7DRfMpxr95tvB7KykBXTVJym8U'
      const screenshot = 'tVnWNFEK9YQEC88YfrHg38mhR'
      const log = '5MuPUNqshGgrzMHGdxCVa6WMrzuAmfp5bu7UxJVTmYk4VRw8WDgU7ZK44gsdqbcKEd9wtMjA9qUSexQSVStnGTxkKa'
      const buf = Buffer.from(`000000000082${json}000000000125${audio}000000000025${screenshot}000000000090${log}`)
      const splitted = splitBuffer(buf)
      expect(splitted.json.toString('utf8')).toBe(json)
      expect(splitted.audio?.toString('utf8')).toBe(audio)
      expect(splitted.screenshot?.toString('utf8')).toBe(screenshot)
      expect(splitted.log?.toString('utf8')).toBe(log)
    })
  })
})
