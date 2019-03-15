const getState = (init = {}) => {
    let count = 0;
    let state = init;
    const listeners = [];

    return {
        state() {
            return state;
        },
        mutate(newState = {}) {
            // Note: When there is no logic, just setters
            state = Object.assign({}, state, newState);
            listeners.forEach(listener => listener(count++));
        },
        listen(callback) {
            listeners.push(callback);
        }
    };
};

export default getState;
