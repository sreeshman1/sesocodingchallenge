/**
 * For the sync solution, I chose to use a heap-based priority queue to keep a list of popped log sources sorted and to 
 * iterate over each popped element until there are no more elements left. The idea was to treat each log source as a linked list 
 * of sorts and only compare the head of each linked list so that both time and space complexity are handled effieciently. 
 * While writing all the log sources into memory then sorting them would be faster time wise, the space complexity tradeoff would not be worth it.
 */

"use strict";

const { PriorityQueue } = require("@datastructures-js/priority-queue");

//Create a heap-based PriorityQueue that values gives a log source higher priority for an earlier date.
const logSourceQueue = new PriorityQueue((a, b) => {
  if (a.source.date < b.source.date) {
    return -1;
  }

  if (a.source.date >= b.source.date) {
    return 1;
  }
});

module.exports = (logSources, printer) => {
  //intial insertion of the heads of the log sources into the priority queue for sorting. 
  //keep track of the index of the log source so that it can be accessed in constant time.
  logSources.forEach((logSource, indx) => {
    const val = logSource.pop();
    if (val) {
      logSourceQueue.enqueue({ index: indx, source: val });
    }
  });
  //loop through the log sources, making sure to only write the popped element to memory
  while (!logSourceQueue.isEmpty()) {
    const printSource = logSourceQueue.dequeue();
    const val = logSources[printSource.index].pop();
    if (val) {
      logSourceQueue.enqueue({ index: printSource.index, source: val });
    }
    printer.print(printSource.source);
  }
  printer.done()
  return console.log("Sync sort complete.");
};
