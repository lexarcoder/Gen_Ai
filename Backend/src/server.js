import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/Database.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
