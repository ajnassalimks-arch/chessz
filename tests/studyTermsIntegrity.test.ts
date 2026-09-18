import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { CHESS_STUDY_TERMS, getTermDefinition } from '../lib/studyTerms';
import { CONTINUOUS_PUZZLES, LICHESS_DIAGNOSTIC_CATEGORIES } from '../lib/puzzles';

test('Study Terms Integrity — Real Historical Positions & Engine Validation', async (t) => {
  assert.ok(CHESS_STUDY_TERMS.length >= 15, 'Should have at least 15 verified study terms');

  await t.test('All study terms have valid FENs and matching playerColor turn', () => {
    for (const term of CHESS_STUDY_TERMS) {
      let chess: Chess;
      try {
        chess = new Chess(term.fen);
      } catch (err: any) {
        assert.fail(`Invalid FEN in term "${term.id}" (${term.termName}): ${term.fen}`);
      }

      const expectedTurn = term.playerColor === 'white' ? 'w' : 'b';
      assert.equal(
        chess.turn(),
        expectedTurn,
        `Side to move mismatch in term "${term.id}": expected ${term.playerColor} (${expectedTurn}), found ${chess.turn()}`
      );
    }
  });

  await t.test('All masterLine moves are legal in chess.js, match declared SAN, and # is genuine checkmate', () => {
    for (const term of CHESS_STUDY_TERMS) {
      const chess = new Chess(term.fen);
      const moves = term.masterLine || [];

      assert.ok(moves.length > 0, `Term "${term.id}" has no masterLine moves`);

      for (let i = 0; i < moves.length; i++) {
        const step = moves[i];
        let played;
        try {
          played = chess.move({
            from: step.from,
            to: step.to,
            promotion: step.promotion || 'q',
          });
        } catch (err: any) {
          assert.fail(
            `Illegal move step ${i + 1} (${step.from}->${step.to} as ${step.san}) in term "${term.id}": ${err.message}`
          );
        }

        assert.ok(
          played,
          `Illegal move in term "${term.id}": ${step.from}->${step.to}. Legal moves: ${chess.moves().join(', ')}`
        );

        assert.equal(
          played.san,
          step.san,
          `SAN mismatch in term "${term.id}" step ${i + 1}: expected ${step.san}, got ${played.san}`
        );

        if (step.san.endsWith('#')) {
          assert.ok(
            chess.isCheckmate(),
            `Move "${step.san}" in term "${term.id}" claimed mate but is not checkmate in chess.js`
          );
        }
      }
    }
  });

  await t.test('All candidateMoves are legal from the initial position and match declared SAN', () => {
    for (const term of CHESS_STUDY_TERMS) {
      assert.ok(term.candidateMoves.length >= 2, `Term "${term.id}" must have at least 2 candidate moves for brainstorming`);
      
      const bestCount = term.candidateMoves.filter((c) => c.isBest).length;
      assert.equal(bestCount, 1, `Term "${term.id}" must have exactly 1 move marked as isBest`);

      for (const cand of term.candidateMoves) {
        const chess = new Chess(term.fen);
        let played;
        try {
          played = chess.move({
            from: cand.from,
            to: cand.to,
            promotion: cand.promotion || 'q',
          });
        } catch (err: any) {
          assert.fail(`Illegal candidate move (${cand.from}->${cand.to} declared as ${cand.san}) in term "${term.id}": ${err.message}`);
        }

        assert.ok(
          played,
          `Candidate move ${cand.from}->${cand.to} in term "${term.id}" is illegal. Legal moves: ${chess.moves().join(', ')}`
        );

        assert.equal(
          played.san,
          cand.san,
          `Candidate move SAN mismatch in term "${term.id}": expected ${cand.san}, got ${played.san}`
        );

        assert.ok(cand.coachFeedback.length > 10, `Candidate move "${cand.san}" in "${term.id}" needs substantive coach feedback`);
      }
    }
  });

  await t.test('All terms have authentic historical attribution and citations', () => {
    for (const term of CHESS_STUDY_TERMS) {
      assert.ok(term.historicalSource, `Term "${term.id}" is missing historicalSource`);
      assert.ok(term.historicalSource.white, `Term "${term.id}" missing White player attribution`);
      assert.ok(term.historicalSource.black, `Term "${term.id}" missing Black player attribution`);
      assert.ok(term.historicalSource.event, `Term "${term.id}" missing event attribution`);
      assert.ok(term.historicalSource.year > 0, `Term "${term.id}" missing year attribution`);
      assert.ok(term.historicalSource.historicalNote.length > 20, `Term "${term.id}" missing detailed historical note`);
      assert.ok(term.goldenRule.length > 15, `Term "${term.id}" missing golden rule`);
      assert.ok(term.amateurBlindspot.length > 15, `Term "${term.id}" missing amateur blindspot`);
      assert.ok(term.radarClues.length >= 2, `Term "${term.id}" must have at least 2 radar clues`);
    }
  });

  await t.test('getTermDefinition correctly resolves by ID, ruleTitle, and alias', () => {
    const byId = getTermDefinition('beg_hanging_piece');
    assert.ok(byId, 'Should resolve by id');
    assert.equal(byId.id, 'beg_hanging_piece');

    const byRule = getTermDefinition('The 2-Second Bodyguard Rule');
    assert.ok(byRule, 'Should resolve by rule title');
    assert.equal(byRule.id, 'beg_hanging_piece');

    const byAlias = getTermDefinition('Zwischenzug');
    assert.ok(byAlias, 'Should resolve by alias');
    assert.equal(byAlias.id, 'adv_zwischenzug');

    const bySub = getTermDefinition('Greek Gift');
    assert.ok(bySub, 'Should resolve by substring');
    assert.equal(bySub.id, 'inter_greek_gift');
  });
});

test('Puzzle Rule Titles Resolve To Study Terms', async (t) => {
  await t.test('every puzzle ruleTitle resolves to a study term', () => {
    // TermHoverCard renders each puzzle's ruleTitle and falls back to plain text
    // when nothing resolves, so an unmapped title fails silently in the UI. This
    // caught 450 of 500 puzzles pointing at terms that did not exist.
    const allPuzzles = [
      ...CONTINUOUS_PUZZLES,
      ...Object.values(LICHESS_DIAGNOSTIC_CATEGORIES).flat(),
    ];
    assert.ok(allPuzzles.length > 0, 'expected puzzles to be loaded');

    const unresolved = new Map();
    for (const puzzle of allPuzzles) {
      assert.ok(puzzle.ruleTitle, `puzzle ${puzzle.id} has no ruleTitle`);
      if (!getTermDefinition(puzzle.ruleTitle)) {
        unresolved.set(puzzle.ruleTitle, (unresolved.get(puzzle.ruleTitle) || 0) + 1);
      }
    }

    assert.deepStrictEqual(
      [...unresolved.entries()].sort((a, b) => b[1] - a[1]),
      [],
      'these puzzle ruleTitles resolve to no study term'
    );
  });
});
