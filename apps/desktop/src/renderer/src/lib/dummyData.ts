export const dummyFiles = [
    { name: 'Project Report.pdf', isDirectory: false },
    { 
      name: 'Financial Statements', 
      isDirectory: true,
      children: [
        { name: 'Q1 Report.xlsx', isDirectory: false },
        { name: 'Q2 Report.xlsx', isDirectory: false },
      ]
    },
    { name: 'Meeting Notes.docx', isDirectory: false },
    { 
      name: 'Product Images', 
      isDirectory: true,
      children: [
        { name: 'Logo.png', isDirectory: false },
        { name: 'Banner.jpg', isDirectory: false },
      ]
    },
    { name: 'Client Presentation.pptx', isDirectory: false },
    { name: 'Budget 2023.xlsx', isDirectory: false },
    { 
      name: 'Marketing Materials', 
      isDirectory: true,
      children: [
        { name: 'Brochure.pdf', isDirectory: false },
        { name: 'Social Media Assets', isDirectory: true, children: [] },
      ]
    },
    { name: 'Employee Handbook.pdf', isDirectory: false },
    { name: 'Source Code', isDirectory: true, children: [] },
    { name: 'Legal Documents', isDirectory: true, children: [] },
    { name: 'Company Logo.png', isDirectory: false },
    { name: 'Customer Feedback.csv', isDirectory: false },
    { name: 'Project Timelines.xlsx', isDirectory: false },
    { name: 'Training Videos', isDirectory: true, children: [] },
    { name: 'Quarterly Report Q2.pdf', isDirectory: false },
  ];
  
  