const contactController = async (request, response) => {
  const { subject, message } = request.body;

  if (!subject || !message) {
    return response.status(400).json({
      success: false,
      message: 'Subject and message are required.',
    });
  }

  return response.status(201).json({
    success: true,
    message: 'Contact request received.',
  });
};

export default {
  contactController,
};
