module.exports = ({ dbRep }) => {
  const testController = async (req, res) => {
    res.sendResponse({ message: 'Test controller' })
  }
  return { testController }
}
