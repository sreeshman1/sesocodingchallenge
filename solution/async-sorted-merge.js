/**
 * For the async solution, I chose to use the same heap based priority queue solution 
 * as I did with the sync solution alongside using async/await and Promise.all to handle 
 * the promises being returned. 
 * */
"use strict";

const { PriorityQueue } = require("@datastructures-js/priority-queue");

const logSourceQueue = new PriorityQueue((a, b) => {
  if (a.source.date < b.source.date) {
    return -1;
  }

  if (a.source.date >= b.source.date) {
    return 1;
  }
});

// Print all entries, across all of the *async* sources, in chronological order.

const getValue = async (logSources, printSource) => {
  return await logSources[printSource.index].popAsync();
}

module.exports = (logSources, printer) => {
  return new Promise(async (resolve) => {
    //Get the head of all the log sources and insert them into the priority queue
    await Promise.all(logSources.map((logSource, indx) => {
      return logSource.popAsync().then((value) => {
        if (value) {
          logSourceQueue.enqueue({ index: indx, source: value });
        }
      })
    }))
    //Iterate through the priority queue, re-inserting the head of the log sources until drained.
    while (!logSourceQueue.isEmpty()) {
      const printSource = logSourceQueue.dequeue();
      const val = await getValue(logSources, printSource);
      if (val) {
        logSourceQueue.enqueue({ index: printSource.index, source: val });
      }
      printer.print(printSource.source);
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
