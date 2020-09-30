import * as SessionState from './SessionState';

export class MatchingInterface {
    constructor(procSessionJoined, procSessionJoinFailed, procUpdatePlayerList, procGameStart) {
        this._procSessionJoined = procSessionJoined;
        this._procSessionJoinFailed = procSessionJoinFailed;
        this._procUpdatePlayerList = procUpdatePlayerList;
        this._procGameStart = procGameStart;
    }
    getProcSessionJoined() {
        return this._procSessionJoined;
    }
    setProcSessionJoined(proc) {
        this._procSessionJoined = proc;
    }
    getProcSessionJoinFailed() {
        return this._procSessionJoinFailed;
    }
    setProcSessionJoinFailed(proc) {
        this._procSessionJoinFailed = proc;
    }
    getProcUpdatePlayerList() {
        return this._procUpdatePlayerList;
    }
    setProcUpdatePlayerList(proc) {
        this._procUpdatePlayerList = proc;
    }
    getProcGameStart() {
        return this._procGameStart;
    }
    setProcGameStart(proc) {
        this._procGameStart = proc;
    }
}

export class GameInterface {
    constructor(procLeavePlayer, procTurnStart, procBidCardOtherPlayer, procTurnFinish, procGameFinish) {
        this._procLeavePlayer = procLeavePlayer;
        this._procTurnStart = procTurnStart;
        this._procBidCardOtherPlayer = procBidCardOtherPlayer;
        this._procTurnFinish = procTurnFinish;
        this._procGameFinish = procGameFinish;
    }
    getProcLeavePlayer() {
        return this._procLeavePlayer;
    }
    setProcLeavePlayer(proc) {
        this._procLeavePlayer = proc;
    }
    getProcTurnStart() {
        return this._procTurnStart;
    }
    setProcTurnStart(proc) {
        this._procTurnStart = proc;
    }
    getProcBidCardOtherPlayer() {
        return this._procBidCardOtherPlayer;
    }
    setProcBidCardOtherPlayer(proc) {
        this._procBidCardOtherPlayer = proc;
    }
    getProcTurnFinish() {
        return this._procTurnFinish;
    }
    setProcTurnFinish(proc) {
        this._procTurnFinish = proc;
    }
    getProcGameFinish() {
        return this._procGameFinish;
    }
    setProcGameFinish(proc) {
        this._procGameFinish = proc;
    }
}

export default class Session {
    constructor(sessionManager, setErrorMessage, playerName) {
        this._symbol = Symbol();
        this._sessionManager = sessionManager;
        this._setErrorMessage = setErrorMessage;
        this._playerName = playerName;
        this._removed = false;
        this._running = false;
        this._ws = null;
        this._openEventListener = null;
        this._messageEventListener = null;
        this._closeEventListener = null;
        this._errorEventListener = null;

        this._matchingInterface = null;
        this._gameInterface = null;

        const state = new SessionState.StartConnect();
        this._state = state;
    }

    get symbol() {
        return this._symbol;
    }

    get playerName() {
        return this._playerName;
    }

    createWebSocket() {
        this.removeWebSocket();
        const env = process.env;
        console.log(env);
        const wsHost = env.REACT_APP_SERVER_HOST || 'localhost';
        const wsPort = env.REACT_APP_SERVER_PORT || 4000;
        const ws = new WebSocket(`ws://${wsHost}:${wsPort}`);
        this._ws = ws;
        const openEventListener = () => { this.getState().openSocket(this); }
        ws.addEventListener('open', openEventListener);
        this._openEventListener = openEventListener;
        const messageEventListener = (msg) => { this.getState().receiveMessage(this, msg); }
        ws.addEventListener('message', messageEventListener);
        this._messageEventListener = messageEventListener;
        const closeEventListener = () => { this.getState().closeSocket(this); }
        ws.addEventListener('close', closeEventListener);
        this._closeEventListener = closeEventListener;
        const errorEventListener = (e) => { this.getState().error(this); }
        ws.addEventListener('error', errorEventListener);
        this._errorEventListener = errorEventListener;
    }
    removeWebSocket() {
        const ws = this.websocket;
        if (ws) {
            this.removeAllEventListener();
            ws.close();
            this._ws = null;
        }
    }
    get websocket() {
        return this._ws;
    }

    removeOpenEventListener() {
        const ws = this.websocket;
        if (!ws) return;

        const openEventListener = this._openEventListener;
        if (openEventListener) {
            ws.removeEventListener('open', openEventListener);
            this._openEventListener = null;
        }
    }
    removeAllEventListener() {
        const ws = this.websocket;
        if (!ws) return;

        this.removeOpenEventListener();
        const messageEventListener = this._messageEventListener;
        if (messageEventListener) {
            ws.removeEventListener('message', messageEventListener);
            this._messageEventListener = null;
        }
        const closeEventListener = this._closeEventListener;
        if (closeEventListener) {
            ws.removeEventListener('close', closeEventListener);
            this._closeEventListener = null;
        }
        const errorEventListener = this._errorEventListener;
        if (errorEventListener) {
            ws.removeEventListener('error', errorEventListener);
            this._errorEventListener = null;
        }
    }

    isRunning() {
        return this._running;
    }
    _procIsRunning(proc, defaultResult = null) {
        return this.isRunning() ? proc() : defaultResult;
    }
    _procIsNotRunning(proc, defaultResult = null) {
        return !this.isRunning() ? proc() : defaultResult;
    }

    start(force = false) {
        if (force) {
            this.stop();
        }
        this._procIsNotRunning(() => {
            this._running = true;
            this.getState().start(this);
        });
    }
    stop() {
        this._procIsRunning(() => {
            this.getState().removeSessionContext(this);
            this.changeState(new SessionState.Sleep());
            this._running = false;
        });
    }

    isRemoved() {
        return this._removed;
    }
    remove() {
        if (!this.isRemoved()) {
            this._sessionManager.removeSession(this);
        }
    }
    removeFromSessionManager() {
        if (!this.isRemoved()) {
            this._remove();
        }
    }
    _remove() {
        this.stop();
        this._removed = true;
    }

    getState() {
        return this._state;
    }
    changeState(newState) {
        const curState = this.getState();
        curState.stop(this);
        this._state = newState;
        newState.start(this);
    }

    sendMessage(message) {
        this.websocket.send(JSON.stringify(message.sendProps()));
    }

    receiveMessage(message) {
        this.getState().receiveMessage(this, message);
    }
    closeSocket() {
        this.getState().closeSocket(this);
    }
    error(error) {
        this.getState().error(this, error);
    }

    setErrorMessage(message) {
        this._setErrorMessage(message);
    }


    getMatchingInterface() {
        return this._matchingInterface;
    }
    setMatchingInterface(iface = null) {
        this._matchingInterface = iface;
    }
    readyGame() {
        this._procIsRunning(() => { this.getState().readyGame(this); });
    }

    getGameInterface() {
        return this._gameInterface;
    }
    setGameInterface(iface = null) {
        this._gameInterface = iface;
    }
    bidCard(turnNum, bidCard) {
        return this._procIsRunning(() => this.getState().bidCard(this, turnNum, bidCard), false);
    }
}
