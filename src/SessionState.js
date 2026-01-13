import Protocol from './protocol';
import { issueRequestId } from './RequestMessage';
import ISessionManager from './SessionManager';
const Message = Protocol.Message;

const errorMessage = {
    networkError: "ネットワークエラーが発生しました",
    serverConnectFailed: "サーバーに接続できませんでした",
}

export class Unknown {
    constructor() {
        this._running = false;
        this._removeSessionContext = false;
    }

    isStart() {
        return this._running;
    }
    _procIsStart(proc, defaultResult = null) {
        return this.isStart() ? proc() : defaultResult;
    }
    _procIsNotStart(proc, defaultResult = null) {
        return !this.isStart() ? proc() : defaultResult;
    }

    hasSessionContext() {
        return false;
    }

    start(session) {
        this._procIsNotStart(() => {
            this._running = true;
            this.hookStart(session);
        });
    }
    stop(session) {
        this._procIsStart(() => {
            this.hookStop(session);
            this._running = false;
        });
    }

    hookStart(/* client */) {}
    hookStop(/* client */) {}

    receiveMessage(session, message) {
        this._procIsStart(() => this.hookReceiveMessage(session, message));
    }
    openSocket(session) {
        this._procIsStart(() => this.hookOpenSocket(session));
    }
    closeSocket(session) {
        this._procIsStart(() => this.hookCloseSocket(session));
    }
    error(session, error) {
        this._procIsStart(() => this.hookError(session, error));
    }
    removeSessionContext(session) {
        if (this.isStart() && this.hasSessionContext() && !this._removeSessionContext) {
            this._removeSessionContext = true;
            this.hookRemoveSessionContext(session);
        }
    }

    hookReceiveMessage(/* session, message */) {}
    hookOpenSocket(/* session */) {}
    hookCloseSocket(/* session */) {}
    hookError(/* session, error */) {}
    hookRemoveSessionContext(/* session */) {}

    readyGame(session) {
        this._procIsStart(() => this.hookReadyGame(session));
    }
    hookReadyGame(/* session */) {}

    bidCard(session, turnNum, bidCard) {
        return this._procIsStart(() => this.hookBidCard(session, turnNum, bidCard), false);
    }
    hookBidCard(/* session, turnNum, bidCard */) {
        return false;
    }
}

export class Sleep extends Unknown {
    hasSessionContext() {
        return false;
    }

    hookStart(/* session */) {}
    hookStop(/* session */) {}

    hookReceiveMessage(/* session, message */) {}
    hookOpenSocket(/* session */) {}
    hookCloseSocket(/* session */) {}
    hookError(/* session, error */) {}
    hookRemoveSessionContext(/* session */) {}

    hookReadyGame(/* session */) {}

    hookBidCard(/* session, turnNum, bidCard */) {
        return false;
    }
}

class ConnectedBase extends Sleep {
    hasSessionContext() {
        return true;
    }
    hookCloseSocket(session) {
        console.log('session: websocket closed.');
        session.setErrorMessage(errorMessage.networkError);
        session.removeAllEventListener();
        session.stop();
        session.remove();
    }
    hookError(session, error) {
        console.log('session: websocket error', error);
        session.setErrorMessage(errorMessage.networkError);
        session.removeAllEventListener();
        session.stop();
        session.remove();
    }
    hookRemoveSessionContext(session) {
        session.removeWebSocket();
    }
}

export class StartConnect extends ConnectedBase {
    hookStart(session) {
        session.createWebSocket();
    }
    hookOpenSocket(session) {
        console.log('session: websocket opened.');
        session.removeOpenEventListener();
    }
    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.Hello)) {
            console.log('session: start connect : invalid message received.');
            session.setErrorMessage(errorMessage.serverConnectFailed);
            session.removeAllEventListener();
            session.stop();
            session.remove();
            return;
        }
        session.changeState(new SignIn());
    }
}

export class SignIn extends ConnectedBase {
    constructor() {
        super();
        this._reqId = null;
    }

    hookStart(session) {
        const reqId = this._reqId = issueRequestId();
        session.sendMessage(new Message.RequestSignIn(reqId, session.playerName));
    }
    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.ResponseSignIn) || (msg.requestId !== this._reqId)) {
            console.log('session: signin : invalid message received.');
            session.setErrorMessage(errorMessage.serverConnectFailed);
            session.removeAllEventListener();
            session.stop();
            session.remove();
            return;
        }
        session.changeState(new Matching.Start());
    }
}

export const Matching = {};

Matching.setReadyGame = function () {
    const session = ISessionManager.getInstance().getSession();
    if (session) {
        session.readyGame();
    }
}

Matching.Start = class extends ConnectedBase {
    constructor() {
        super();
        this._reqId = null;
    }

    hookStart(session) {
        const reqId = this._reqId = issueRequestId();
        session.sendMessage(new Message.Matching.RequestJoin(reqId));
    }
    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.Matching.ResponseJoin) || (msg.requestId !== this._reqId)) {
            super.hookReceiveMessage(session, message);
            return;
        }
        const matchingInterface = session.getMatchingInterface();

        if (msg.isAllow()) {
            if (matchingInterface) {
                const procSessionJoined = matchingInterface.getProcSessionJoined();
                procSessionJoined(Matching.setReadyGame, msg.getPlayerInfos());
            }
            session.changeState(new Matching.WaitReadyGame());
        } else {
            if (matchingInterface) {
                const procSessionJoinFailed = matchingInterface.getProcSessionJoinFailed();
                procSessionJoinFailed();
            }
            session.removeAllEventListener();
            session.stop();
            session.remove();
            return;
        }
    }
}

Matching.JoinedBase = class extends ConnectedBase {
    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.Matching.UpdatePlayers)) {
            super.hookReceiveMessage(session, message);
            return;
        }
        const matchingInterface = session.getMatchingInterface();
        if (!matchingInterface) return;
        const procUpdatePlayerList = matchingInterface.getProcUpdatePlayerList();
        procUpdatePlayerList(msg.getPlayerInfos());
    }
}

Matching.WaitReadyGame = class extends Matching.JoinedBase {
    hookReadyGame(session) {
        session.changeState(new Matching.RequestReadyGame());
    }
}

Matching.RequestReadyGame = class extends Matching.JoinedBase {
    constructor() {
        super();
        this._reqId = null;
    }

    hookStart(session) {
        const reqId = this._reqId = issueRequestId();
        session.sendMessage(new Message.Matching.RequestReadyGame(reqId));
    }
    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.Matching.ResponseReadyGame) || (msg.requestId !== this._reqId)) {
            super.hookReceiveMessage(session, message);
            return;
        }
        session.changeState(new Matching.WaitGameStart());
    }
}

Matching.WaitGameStart = class extends Matching.JoinedBase {
}


export const Game = {};

Game.InGameBase = class extends ConnectedBase {
    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (msg && (msg instanceof Message.Game.FinishGame)) { // ゲーム中は他プレイヤーの離脱により、いつでもゲーム終了する可能性があります
            session.changeState(new Game.FinishGame(msg.getGameInfo()));
            return;
        }
        if (msg && (msg instanceof Message.Game.LeavePlayer)) {
            const gameInterface = session.getGameInterface();
            if (gameInterface) {
                const procLeavePlayer = gameInterface.getProcLeavePlayer();
                procLeavePlayer(msg.getPlayerId());
            }
            return;
        }
        super.hookReceiveMessage(session, message);
    }

    procUpdatePlayerBidStatusMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.Game.UpdatePlayerBidStatus)) {
            return msg;
        }
        const gameInterface = session.getGameInterface();
        if (gameInterface) {
            const procBidCardOtherPlayer = gameInterface.getProcBidCardOtherPlayer();
            procBidCardOtherPlayer(msg.getTurnNum(), msg.getPlayerId());
        }
        return null;
    }
}

Game.StartGame = class extends Game.InGameBase {
    constructor(gameInfo) {
        super();
        this._gameInfo = gameInfo;
    }

    get gameInfo() {
        return this._gameInfo;
    }

    hookStart(session) {
        const matchingInterface = session.getMatchingInterface();
        if (!matchingInterface) return;
        const procGameStart = matchingInterface.getProcGameStart();
        procGameStart(this.gameInfo);
        session.changeState(new Game.Bid());
    }
}

Game.Bid = class extends Game.InGameBase {
    hookReceiveMessage(session, message) {
        const msg = this.procUpdatePlayerBidStatusMessage(session, message);
        if (msg) {
            super.hookReceiveMessage(session, message);
        }
    }

    hookBidCard(session, turnNum, bidCard) {
        session.changeState(new Game.RequestBid(turnNum, bidCard));
        return true;
    }
}

Game.RequestBid = class extends Game.InGameBase {
    constructor(turnNum, bidCard) {
        super();
        this._reqId = null;
        this._turnNum = turnNum;
        this._bidCard = bidCard;
    }

    hookStart(session) {
        const reqId = this._reqId = issueRequestId();
        session.sendMessage(new Message.Game.RequestBid(reqId, this._turnNum, this._bidCard));
    }

    hookReceiveMessage(session, message) {
        const msg = this.procUpdatePlayerBidStatusMessage(session, message);
        if (!msg) return;
        if (!(msg instanceof Message.Game.ResponseBid)) {
            super.hookReceiveMessage(session, message);
            return;
        }
        if ((msg.requestId !== this._reqId) || (msg.getResultCode() < 0)) {
            console.error(`session: game : request bid : invalid message received : ${msg.requestId} : ${msg.getResultCode()}`);
            session.setErrorMessage(errorMessage.networkError);
            session.removeAllEventListener();
            session.stop();
            session.remove();
            return;
        }
        session.changeState(new Game.WaitFinishTurn());
    }
}

Game.WaitFinishTurn = class extends Game.InGameBase {
    hookReceiveMessage(session, message) {
        const msg = this.procUpdatePlayerBidStatusMessage(session, message);
        if (!msg) return;
        if (!(msg instanceof Message.Game.FinishTurn)) {
            super.hookReceiveMessage(session, message);
            return;
        }
        session.changeState(new Game.FinishTurn(msg.getGameInfo()));
    }
}

Game.FinishTurn = class extends Game.InGameBase {
    constructor(gameInfo) {
        super();
        this._gameInfo = gameInfo;
    }

    get gameInfo() {
        return this._gameInfo;
    }

    hookStart(session) {
        const gameInterface = session.getGameInterface();
        if (!gameInterface) return;
        const procTurnFinish = gameInterface.getProcTurnFinish();
        procTurnFinish(this.gameInfo);
    }

    hookReceiveMessage(session, message) {
        const msg = Message.parseMessage(message);
        if (!msg || !(msg instanceof Message.Game.StartTurn)) {
            super.hookReceiveMessage(session, message);
            return;
        }
        const gameInterface = session.getGameInterface();
        if (!gameInterface) return;
        const procTurnStart = gameInterface.getProcTurnStart();
        procTurnStart(msg.getGameInfo());
        session.changeState(new Game.Bid());
    }
}

Game.FinishGame = class extends Sleep {
    constructor(gameInfo) {
        super();
        this._gameInfo = gameInfo;
    }

    get gameInfo() {
        return this._gameInfo;
    }

    hookStart(session) {
        const gameInterface = session.getGameInterface();
        if (!gameInterface) return;
        const procGameFinish = gameInterface.getProcGameFinish();
        procGameFinish(this.gameInfo);
        session.removeWebSocket();
        session.remove();
    }
}
