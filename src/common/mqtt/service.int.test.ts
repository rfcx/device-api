import { muteConsole } from '../db/testing'
import { parseMessage } from './service'
import { readFileSync } from 'fs'

const testFile = readFileSync('./test/mqtt-message-1')

beforeAll(() => {
  muteConsole(['info'])
})

describe('parseMessage function', () => {
  test('1', async () => {
    const json = await parseMessage(testFile)
    expect(json.checkins).toBe('sent*2*285384*1673027801900*1673027984198|queued*17*1646647|meta*56*28233|skipped*2*279592|stashed*0*0|archived*35*5015552|vault*0*0')
  })
})
