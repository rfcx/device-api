import Guardian from './guardian.model'

export async function get (id: string, field: 'id' | 'guid' = 'id'): Promise<Guardian | null> {
  return await Guardian.findOne({
    where: {
      [field]: id
    }
  })
}

export default { get }
