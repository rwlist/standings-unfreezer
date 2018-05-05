import cloneDeep from 'clone-deep';

class LLTE {
    static generateEmptyCells(problems) {
        return problems.map(it => ({
            title: it.title,
            longName: it.longName,
            status: 'nothing',
            display: '.',
            score: 0,
            lastSubmission: -1
        }));
    }

    static generateEmptyRow(user, problems) {
        const row = {};
        row.score = 0;
        row.id = user.id;
        row.loginName = user.loginName;
        row.displayedName = user.displayedName;
        row.hidden = user.hidden;
        row.cells = LLTE.generateEmptyCells(problems);
        row.lastSubmission = -1;
        row.displayedPlace = 1; // TODO: calculate displayedPlace as count of better users
        row.actualPlace = 0;
        return row;
    }

    static generateEmptyTable(users, problems) {
        const table = {};
        table.problems = problems;
        table.rows = users.map(it => LLTE.generateEmptyRow(it, table.problems));
        table.rowOffset = 0;
        table.rowSize = 25;
        return table;
    }

    static findUser(users, id) {
        return users.find(it => it.id === id);
    }

    static generate(contest, opts) {
        const llte = [];
        const {
            removeDecrSubmits,
            hideUsers,
            freezeTime
        } = opts;

        const users = Array.from(contest.users).filter(it => {
            if (hideUsers) {
                return !it.hidden;
            } else {
                return true;
            }
        });

        const _users = users.map(_it => {
            const it = cloneDeep(_it);
            it.maxScore = {};
            it.lastSubmits = {};
            return it;
        });

        const problems = Array.from(contest.problems);
        const submits = Array.from(cloneDeep(contest.submits)).filter(it => {
            const user = LLTE.findUser(_users, it.userId);
            if (!user) {
                return false;
            }
            if (it.score == null) {
                return false;
            }
            it.score = parseFloat(it.score);
            if (removeDecrSubmits) {
                if (user.maxScore[it.problemTitle] > it.score) {
                    return false;
                }
                user.maxScore[it.problemTitle] = it.score;
            }
            return true;
        }).map(it => {
            const user = LLTE.findUser(_users, it.userId);
            it.isLast = true;
            if (user.lastSubmits[it.problemTitle]) {
                user.lastSubmits[it.problemTitle].isLast = false;
            }
            user.lastSubmits[it.problemTitle] = it;
            return it;
        });

        console.log(submits);

        const visibleSubmits = submits.filter(it => {
            return it.contestTime < freezeTime;
        });

        const frozenSubmits = submits.filter(it => {
            return it.contestTime >= freezeTime;
        });

        let table = LLTE.generateEmptyTable(users, problems);

        const list = [
            {
                event: 'createTable',
                table: cloneDeep(table)
            }
        ];

        visibleSubmits.forEach(it => {
            const update = LLTE.fullApplySubmission(table, it);
            list.push(...update.events);
        })

        llte.push({
            event: 'multiple',
            list: list
        });

        frozenSubmits.forEach(it => {
            const update = LLTE.fullApplySubmission(table, it);
            llte.push({
                event: 'multiple',
                list: update.events
            });
        });

        return llte;
    }

    static defaultComparator(row1, row2) {
        if (row1.score !== row2.score) {
            return row1.score - row2.score;
        }
        if (row1.lastSubmission !== row2.lastSubmission) {
            return row1.lastSubmission - row2.lastSubmission;
        }
        return row1.id - row2.id;
    }

    static findRow(table, id) {
        return table.rows.find(it => it.id === id);
    }

    static findCell(row, title) {
        return row.cells.find(it => it.title === title);
    }

    static fullApplySubmission(table, submission) {
        const events = [];
        const row = LLTE.findRow(table, submission.userId);
        const cell = LLTE.findCell(row, submission.problemTitle);
        events.push({
            event: 'cellUpdate',
            rowId: row.id,
            cellTitle: cell.title,
            update: {
                status: submission.isLast ? 'final' : 'pending',
                display: submission.score + (submission.isLast ? '' : '?'),
                score: submission.score,
                lastSubmission: submission.contestTime
            }
        });
        LLTE.applyEvent(table, events[0]);
        events.push(LLTE.fixRow(row));
        LLTE.applyEvent(table, events[1]);
        const fix = LLTE.fixTable(table);
        fix.events.forEach(it => {
            LLTE.applyEvent(table, it);
            events.push(it);
        });
        return { table, events };
    }

    static fixRow(row) {
        return {
            event: 'rowUpdate',
            rowId: row.id,
            update: {
                lastSubmission: Math.max(
                    ...(row.cells.map(it => it.lastSubmission))
                ),
                score: row.cells.map(it => it.score).reduce((a, b) => a + b, 0)
            }
        };
    }

    static fixTable(_table) {
        let table = cloneDeep(_table);
        table.rows.sort(LLTE.defaultComparator);
        const events = [];
        table.rows.forEach(it => {
            const _row = LLTE.findRow(_table, it.id);
            if (_row.actualPlace !== it.actualPlace ||
                _row.displayedPlace !== it.displayedPlace) {
                events.push({
                    event: 'rowUpdate',
                    update: {
                        actualPlace: it.actualPlace,
                        displayedPlace: it.displayedPlace
                    }
                });
            }
        });
        return { events };
    }

    // Applies event in place, mutates `table`
    static applyEvent(table, event) {
        if (event.event === 'multiple') {
            event.list.forEach(it => {
                LLTE.applyEvent(table, it);
            });
            return { table, event };
        }
        if (event.event === 'createTable') {
            Object.assign(table, event.table);
            return { table, event };
        }
        if (event.event === 'cellUpdate') {
            const row = LLTE.findRow(table, event.rowId);
            const cell = LLTE.findCell(row, event.cellTitle);
            Object.assign(cell, event.update);
            return { table, event };
        }
        if (event.event === 'rowUpdate') {
            const row = LLTE.findRow(table, event.rowId);
            Object.assign(row, event.update);
            return { table, event };
        }
        console.error('unknown event', event);
    }
}

export default LLTE;