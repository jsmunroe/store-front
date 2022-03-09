// See: https://lazamar.github.io/dispatching-from-inside-of-reducers/

// This middleware will just add the "dispatch" method to all actions
const dispatchMiddleware = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue = [];
  
    function flushQueue() {
        actionQueue.forEach(a => store.dispatch(a)); // flush queue
        actionQueue = [];
    }
  
    function dispatch(asyncAction) {
        actionQueue = actionQueue.concat([asyncAction]);
  
        if (syncActivityFinished) {
            flushQueue();
        }
    }
    
    const res = next({...action, dispatch});
  
    syncActivityFinished = true;
    flushQueue();
  
    return res;
};

export default dispatchMiddleware;