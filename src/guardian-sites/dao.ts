import GuardianSite from './guardian-site.model'

export async function get (id: string, field: 'id' | 'guid' = 'id'): Promise<GuardianSite | null> {
  return await GuardianSite.findOne({
    where: {
      [field]: id
    }
  })
}

export default { get }
