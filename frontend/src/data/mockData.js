// data/mockData.js

// Mock database - In a real app, this would be stored in a backend database
export const mockItems = [
  { id: 1, name: 'Swinburne T-Shirt', price: 180, stock: 'Available', image: '/images/SwinTShirt.png' },
  { id: 2, name: 'Swinburne Hoodie (Red)', price: 420, stock: 'Out of Stock', image: '/images/SwinRedHoodie.png' },
  { id: 3, name: 'Swinburne Teddy Bear (Brown)', price: 150, stock: 'Out of Stock', image: '/images/SwinTeddyBear.png' },
  { id: 4, name: 'Swinburne Teddy Bear (Beige)', price: 200, stock: 'Out of Stock', image: '/images/SwinTeddyBearBeige.jpg' },
  { id: 5, name: 'Swinburne Notebook and Pen', price: 30, stock: 'Available', image: '/images/SwinNotebook.jpg' },
  { id: 6, name: 'Swinburne Thermal Bottle', price: 330, stock: 'Out of Stock', image: '/images/SwinWaterBottle.png' },
  { id: 7, name: 'Swinburne Umbrella', price: 170, stock: 'Out of Stock', image: '/images/SwinUmbrella.png' },
  { id: 8, name: 'Swinburne Tote (Black)', price: 140, stock: 'Available', image: '/images/SwinToteBlack.jpg' },
];

export const mockTransactions = [
  { id: 1, itemName: 'Swinburne T-Shirt', quantity: '2',price: '360', date: '2025-03-28', status: 'Completed' },
  { id: 2, itemName: 'Swinburne Notebook and Pen', quantity: '1',price: '30', date: '2025-04-25', status: 'Completed' },
  { id: 3, itemName: 'Swinburne Tote (Black)', quantity: '1',price: '140', date: '2025-05-20', status: 'Completed' }
];