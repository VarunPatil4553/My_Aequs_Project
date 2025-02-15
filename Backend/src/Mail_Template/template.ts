const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Function to load Handlebars template
const loadTemplate = (templateName: any, data: any) => {
  const filePath = path.join(__dirname, `templates/${templateName}.html`);
  const templateSource = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  return template(data);
};

// Email Configuration

// Endpoint to send test email

const data = {
  name: 'John Doe',
  employeeId: 'EMP12345',
  department: 'Engineering',
};

const emailContent = loadTemplate('test-email', data);

const mailOptions = {
  from: '"Your Company" <your-email@gmail.com>',
  to: 'recipient@example.com',
  subject: 'Test Email',
  html: emailContent,
};
