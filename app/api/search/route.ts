import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // 默认使用 multilingual tokenizer，支持中文分词
  // https://docs.orama.com/docs/orama-js/supported-languages
});
