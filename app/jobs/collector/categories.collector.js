const { http, addCategory, logger } = require('../../utils')

let running = false
let processedCount = 0

module.exports = { getAllCategories }

async function processSubCategories (categoryId) {
  try {
    const category = await http.getCategory(categoryId)
    processedCount++
    logger.info(`[Collected Category ✔️]: ${categoryId} - ${processedCount}`)
    await addCategory(categoryId)
    if (!category.children_categories.length) return
    const subCategories = category.children_categories.map(c => c.id)
    for (const subCategory of subCategories) {
      await processSubCategories(subCategory)
    }
  } catch (err) {
    logger.error(`[Error Category collect ❌]: ${categoryId}`, err.message)
  }
}

async function getAllCategories (req, res) {
  if (running) {
    return res.status(403).send({ message: `Categories collect already running` })
  }
  res.status(202).send({ message: `Categories collect triggered successfully` })
  console.log('Started Categories collect')
  running = true
  const mainCategoriesOfInterest = [
    'MLA1648', // Computación
    'MLA1051', // Celulares y Teléfonos
    'MLA1039', // Cámaras y Accesorios
    'MLA5726', // Electrodomésticos y Aires Ac.
    'MLA1000' // Electrónica, Audio y Video
    // 'MLA1574', // Hogar, Muebles y Jardín
    // 'MLA1499', // Industrias y Oficinas
    // 'MLA1430' // Ropa y Accesorios
  ]
  const promises = mainCategoriesOfInterest.map(async (id) => {
    await processSubCategories(id)
    logger.info('[Main Category collected 🆗]:', id)
  })
  const resetRunning = () => { running = false }
  return Promise.all(promises).then(resetRunning).catch(resetRunning)
}
