import Typesense from 'typesense';
import 'dotenv/config';
import diffusionDB from './data/data.json';

(async () => {
  console.log('Connecting to typesense server...');

  const typesense = new Typesense.Client({
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY || 'xyz',
    nodes: [
      {
        host: process.env.VITE_TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.VITE_TYPESENSE_PORT || '8108'),
        protocol: process.env.VITE_TYPESENSE_PROTOCOL || 'http',
      },
    ],
    connectionTimeoutSeconds: 60 * 60,
  });

  try {
    await typesense.collections('DiffusionDB').retrieve();
    console.log('Found existing collection of DiffusionDB');

    if (process.env.FORCE_REINDEX !== 'true')
      return console.log('FORCE_REINDEX = false. Canceling operation...');

    console.log('Deleting collection');
    await typesense.collections('DiffusionDB').delete();
  } catch (err) {
    console.error(err);
  }

  console.log('Creating schema...');

  await typesense.collections().create({
    name: 'DiffusionDB',
    fields: [
      {
        name: 'image_name',
        type: 'string',
      },
      {
        name: 'prompt',
        type: 'string',
      },
      {
        name: 'seed',
        type: 'string',
      },
      {
        name: 'step',
        type: 'string',
      },
      {
        name: 'cfg',
        type: 'auto',
      },
      {
        name: 'sampler',
        type: 'string',
      },
    ],
    voice_query_model: {
      model_name: 'ts/whisper/base.en',
    },
  });

  console.log('Indexing data');

  try {
    const returnData = await typesense
      .collections('DiffusionDB')
      .documents()
      .import(diffusionDB);

    console.log('Return data: ', returnData);
  } catch (error) {
    console.log(error);
  }
})();
