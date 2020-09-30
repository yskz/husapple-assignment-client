const AppStateId = (() => {
    const createId = (() => {
        let index = 0;
        return () => {
            const id = index;
            index += 1;
            return id;
        };
    })();
    return {
        error: createId(),
        inputPlayerName: createId(),
        matching: createId(),
        game: createId(),
    };
})();

export default AppStateId;
