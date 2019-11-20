/**
 * @description Busca uma pagina de resultados
 * @param {{ page: Number, pageSize: Number, includeCount: boolean }} options
 * @returns {Promise}
 */
const paginate = async function (
  page,
  pageSize = parseInt(process.env.PAGE_SIZE) || 30,
  includeTotal = false
) {
  if (isNaN(page) || isNaN(pageSize) || page < 1) {
    throw new Error('Invalid pagination args')
  }
  const totalCountPromise = includeTotal
    ? this.clone().clearSelect().clearOrder().count('* as cnt').first()
    : new Promise((resolve, reject) => resolve(null))
  const [total, items] = await Promise.all([
    totalCountPromise,
    this.offset((page - 1) * pageSize).limit(pageSize)
  ])
  return {
    currentPage: page,
    items,
    pageSize,
    ...(includeTotal ? { total: parseInt(total.cnt) } : {})
  }
}

module.exports = paginate
