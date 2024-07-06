import { localDataSource, neonDataSource } from './data-source';

async function initializeDataSources() {
    try {
        await localDataSource.initialize();
        console.log('Local database connection established');
        await neonDataSource.initialize();
        console.log('Neon database connection established');
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
    }
}

initializeDataSources();
