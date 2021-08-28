import mongoose from '~/config/mongoose';
import { HOST, PORT } from '~/config/env';
import app from '~/config/express';

app.listen(PORT, HOST, () => {
	console.log('██████╗░░░██╗██╗███████╗');
	console.log('██╔══██╗░██╔╝██║╚════██║');
	console.log('██║░░██║██╔╝░██║░░███╔═╝');
	console.log('██║░░██║███████║██╔══╝░░');
	console.log('██████╔╝╚════██║███████╗');
	console.log('╚═════╝░░░░░░╚═╝╚══════╝');
	console.log('🚀 App: Bootstrap Succeeded');
	console.log(`🚀 Host: http://${HOST}:${PORT}`);
	mongoose();
});
