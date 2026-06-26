import { createServer } from 'http';
import { app } from './app';
import { socketService } from './services/socket.service';
import { startWorker } from './services/worker';

const PORT = process.env.PORT || 3000;

const server = createServer(app);

socketService.init(server);
startWorker();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
