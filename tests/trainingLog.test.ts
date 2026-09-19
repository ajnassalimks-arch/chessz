import test from 'node:test';
import assert from 'node:assert/strict';
import {
  recordAttempt,
  getAttempts,
  getMasteryMap,
  __resetTrainingLogForTests,
} from '../lib/trainingLog';
import { __resetLibraryForTests } from '../lib/gameLibrary';

/**
 * In-memory IDB mockup tailored for the gameLibrary + trainingLog stores.
 */
class MemoryIndex {
  constructor(
    private store: MemoryObjectStore,
    private keyPath: string
  ) {}

  getAll(key?: any) {
    const req: any = { result: null, onsuccess: null, onerror: null };
    queueMicrotask(() => {
      const items = Array.from(this.store.records.values());
      const filtered = key !== undefined
        ? items.filter((item) => item[this.keyPath] === key)
        : items;
      req.result = filtered;
      if (req.onsuccess) req.onsuccess();
    });
    return req;
  }
}

class MemoryObjectStore {
  records = new Map<any, any>();
  private autoId = 1;
  indexes = new Map<string, MemoryIndex>();

  constructor(
    public name: string,
    public options?: { keyPath?: string; autoIncrement?: boolean }
  ) {}

  createIndex(name: string, keyPath: string) {
    const idx = new MemoryIndex(this, keyPath);
    this.indexes.set(name, idx);
    return idx;
  }

  index(name: string) {
    return this.indexes.get(name)!;
  }

  add(value: any) {
    const record = { ...value };
    if (this.options?.autoIncrement && (!record.id || record.id === undefined)) {
      record.id = this.autoId++;
    }
    const key = this.options?.keyPath ? record[this.options.keyPath] : this.autoId++;
    this.records.set(key, record);
    return record;
  }
}

class MemoryTransaction {
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;

  constructor(
    private stores: Map<string, MemoryObjectStore>,
    private storeName: string
  ) {
    queueMicrotask(() => {
      if (this.oncomplete) this.oncomplete();
    });
  }

  objectStore(name: string) {
    return this.stores.get(name)!;
  }
}

class MemoryDatabase {
  stores = new Map<string, MemoryObjectStore>();

  objectStoreNames = {
    contains: (name: string) => this.stores.has(name),
  };

  createObjectStore(name: string, options?: any) {
    const store = new MemoryObjectStore(name, options);
    this.stores.set(name, store);
    return store;
  }

  transaction(storeName: string, mode: string) {
    return new MemoryTransaction(this.stores, storeName);
  }
}

class MemoryIndexedDB {
  db = new MemoryDatabase();

  open(name: string, version: number) {
    const req: any = {
      result: this.db,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };
    queueMicrotask(() => {
      if (req.onupgradeneeded) {
        req.onupgradeneeded();
      }
      if (req.onsuccess) {
        req.onsuccess();
      }
    });
    return req;
  }
}

class MemoryLocalStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

function setupEnvironment() {
  const fakeIdb = new MemoryIndexedDB();
  const fakeStorage = new MemoryLocalStorage();
  const fakeWindow: any = { indexedDB: fakeIdb };

  (globalThis as any).window = fakeWindow;
  (globalThis as any).indexedDB = fakeIdb;
  (globalThis as any).localStorage = fakeStorage;

  __resetLibraryForTests();
  __resetTrainingLogForTests();

  return { fakeIdb, fakeStorage };
}

function teardownEnvironment() {
  delete (globalThis as any).window;
  delete (globalThis as any).indexedDB;
  delete (globalThis as any).localStorage;
  __resetLibraryForTests();
  __resetTrainingLogForTests();
}

test('Training Log - Invariants and Mastery Map', async (t) => {
  t.beforeEach(() => {
    setupEnvironment();
  });

  t.afterEach(() => {
    teardownEnvironment();
  });

  await t.test('records attempts with correct attributes and accounts', async () => {
    await recordAttempt('Carlsen', {
      puzzleId: 'lichess_game1_p24',
      gameId: 'game1',
      ply: 24,
      category: 'hanging_piece',
      tier: 'intermediate',
      source: 'blunder',
      correct: false,
      usedEngine: false,
    });

    await recordAttempt('carlsen', {
      puzzleId: 'lichess_game1_p24',
      gameId: 'game1',
      ply: 24,
      category: 'hanging_piece',
      tier: 'intermediate',
      source: 'blunder',
      correct: true,
      usedEngine: false,
    });

    // Another user's attempt should not bleed into Carlsen's attempts
    await recordAttempt('Nakamura', {
      puzzleId: 'lichess_game2_p10',
      source: 'blunder',
      correct: true,
      usedEngine: false,
    });

    const carlsenAttempts = await getAttempts('Carlsen');
    assert.equal(carlsenAttempts.length, 2);
    assert.equal(carlsenAttempts[0].user, 'carlsen'); // lowercased
    assert.equal(carlsenAttempts[0].correct, true);
    assert.equal(carlsenAttempts[1].correct, false);

    const nakamuraAttempts = await getAttempts('nakamura');
    assert.equal(nakamuraAttempts.length, 1);
    assert.equal(nakamuraAttempts[0].puzzleId, 'lichess_game2_p10');
  });

  await t.test('derives mastery map correctly from attempt log', async () => {
    const user = 'tactician';

    // Puzzle 1: failed twice, then solved once
    await recordAttempt(user, {
      puzzleId: 'puzzle_1',
      source: 'blunder',
      correct: false,
      usedEngine: false,
    });
    await recordAttempt(user, {
      puzzleId: 'puzzle_1',
      source: 'blunder',
      correct: false,
      usedEngine: false,
    });
    await recordAttempt(user, {
      puzzleId: 'puzzle_1',
      source: 'blunder',
      correct: true,
      usedEngine: false,
    });

    // Puzzle 2: failed only
    await recordAttempt(user, {
      puzzleId: 'puzzle_2',
      source: 'blunder',
      correct: false,
      usedEngine: false,
    });

    // Puzzle 3: solved on first try
    await recordAttempt(user, {
      puzzleId: 'puzzle_3',
      source: 'curated',
      correct: true,
      usedEngine: false,
    });

    const mastery = await getMasteryMap(user);

    const m1 = mastery.get('puzzle_1');
    assert.ok(m1);
    assert.equal(m1.attempts, 3);
    assert.equal(m1.correct, 1);
    assert.equal(m1.everCorrect, true);

    const m2 = mastery.get('puzzle_2');
    assert.ok(m2);
    assert.equal(m2.attempts, 1);
    assert.equal(m2.correct, 0);
    assert.equal(m2.everCorrect, false);

    const m3 = mastery.get('puzzle_3');
    assert.ok(m3);
    assert.equal(m3.attempts, 1);
    assert.equal(m3.correct, 1);
    assert.equal(m3.everCorrect, true);

    const m4 = mastery.get('nonexistent');
    assert.equal(m4, undefined);
  });

  await t.test('migrates legacy chessz_mastered_blunders on first ready', async () => {
    const { fakeStorage } = setupEnvironment();
    fakeStorage.setItem(
      'chessz_mastered_blunders',
      JSON.stringify(['lichess_abc123_p18', 'lichess_def456_p30'])
    );

    // Opening attempts for 'student' should trigger migration
    const mastery = await getMasteryMap('student');

    // Both legacy blunders should be registered as everCorrect: true
    assert.equal(mastery.get('lichess_abc123_p18')?.everCorrect, true);
    assert.equal(mastery.get('lichess_def456_p30')?.everCorrect, true);

    // Old localStorage key must be cleared
    assert.equal(fakeStorage.getItem('chessz_mastered_blunders'), null);
  });
});
