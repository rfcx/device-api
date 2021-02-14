export const findOrCreateItem = (model: any, where: any, defaults: any): any => {
  return model.findOrCreate({ where, defaults })
    .spread((item: any, created: any) => {
      return item
    })
}
