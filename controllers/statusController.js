const { updateArrivalCardStatus } = require('../repositories/arrivalCardRepository');

const updateStatus = async (req, res, next) => {
  console.log("Hello world")
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }
    const updated = await updateArrivalCardStatus(id, status);
    res.json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // ...existing exports...
  updateStatus,
};