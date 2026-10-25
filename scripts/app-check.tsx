import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/* ── minimal browser mocks (SSR smoke test only) ── */
const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
  setItem: (key: string, value: string) => void store.set(key, String(value)),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
  key: (index: number) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
};

const g = globalThis as unknown as Record<string, unknown>;
g.localStorage = localStorageMock;
g.window = {
  innerWidth: 1500,
  innerHeight: 950,
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {},
  removeEventListener() {},
  print() {},
  localStorage: localStorageMock,
};
g.document = {
  documentElement: { dataset: {} },
  addEventListener() {},
  removeEventListener() {},
  body: { style: {}, appendChild() {}, removeChild() {} },
  fonts: { ready: Promise.resolve() },
  querySelector: () => null,
  querySelectorAll: () => [],
};
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
g.ResizeObserver = ResizeObserverMock;

async function main() {
  const { default: App } = await import('../src/App');
  const { EditorPanel } = await import('../src/components/EditorPanel');
  const html = renderToStaticMarkup(<App />);
  console.log('App rendered, length:', html.length);

  const { TAB_META } = await import('../src/components/navigation');
  for (const meta of TAB_META) {
    try {
      const markup = renderToStaticMarkup(
        <EditorPanel activeTab={meta.id} onTab={() => undefined} />
      );
      console.log('tab', meta.id, 'ok', markup.length);
    } catch (error) {
      console.log('tab', meta.id, 'FAILED', (error as Error).message);
    }
  }
}

void main();
