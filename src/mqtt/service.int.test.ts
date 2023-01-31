import { muteConsole } from '../common/db/testing'
import { parseMessage } from './service'
import { readFileSync } from 'fs'

const checkinFile = readFileSync('./test/mqtt-message-checkin')
const pingFile = readFileSync('./test/mqtt-message-ping')

beforeAll(() => {
  muteConsole(['info'])
})

describe('parseMessage function', () => {
  test('checkin', async () => {
    const json = await parseMessage(checkinFile)
    // TODO: update expectations once parseMessage func is finished
    expect(json.checkins).toBe('sent*2*285384*1673027801900*1673027984198|queued*17*1646647|meta*56*28233|skipped*2*279592|stashed*0*0|archived*35*5015552|vault*0*0')
  })
  test('ping', async () => {
    const json = await parseMessage(pingFile)
    // TODO: update expectations once parseMessage func is finished
    expect(json.checkins).toBe('sent*2*285384*1673027801900*1673027984198|queued*17*1646647|meta*56*28233|skipped*2*279592|stashed*0*0|archived*35*5015552|vault*0*0')
  })
})
