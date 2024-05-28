import Typesense from 'typesense';
import 'dotenv/config';
import fs from 'fs/promises';
import { resolve } from 'path';

const COLLECTION_NAME = 'podcasts';
(async () => {
  console.log('Connecting to typesense server...');

  const typesense = new Typesense.Client({
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY || 'xyz',
    nodes: [
      {
        url: process.env.VITE_TYPESENSE_URL || 'http://localhost:8108',
      },
    ],
    connectionTimeoutSeconds: 60 * 60,
  });

  try {
    await typesense.collections(COLLECTION_NAME).retrieve();
    console.log(`Found existing collection of ${COLLECTION_NAME}`);

    if (process.env.FORCE_REINDEX !== 'true')
      return console.log('FORCE_REINDEX = false. Canceling operation...');

    console.log('Deleting collection');
    await typesense.collections(COLLECTION_NAME).delete();
  } catch (err) {
    console.error(err);
  }

  console.log('Creating schema...');

  await typesense.collections().create({
    name: COLLECTION_NAME,
    fields: [
      {
        name: 'title',
        type: 'string',
      },
      {
        name: 'author',
        type: 'string',
      },
      {
        name: 'description',
        type: 'string',
      },
    ],
    voice_query_model: {
      model_name: 'ts/whisper/base.en',
    },
  });

  console.log('Indexing data');

  const jsonlPodcasts = await fs.readFile(
    resolve(resolve(), './scripts/data/podcasts-1000-samples.jsonl'),
    'utf-8'
  );

  try {
    const returnData = await typesense
      .collections(COLLECTION_NAME)
      .documents()
      .import(jsonlPodcasts);

    console.log('Return data: ', returnData);
  } catch (error) {
    console.log(error);
  }
})();
