import Session from './Session';
import Protocol from './protocol';

class SessionManager {
    constructor() {
        this._session = null;
    }

    getSession() {
        return this._session;
    }

    createSession(setErrorMessage, playerName) {
        if (!(typeof playerName === 'string') || (playerName.length <= 0) || (Protocol.playerNameMaxLength < playerName.length)) {
            throw Error(`invalid player name : ${playerName}`);
        }
        const curSession = this.getSession();
        if (curSession) {
            this.removeSession(curSession);
        }
        const session = new Session(this, setErrorMessage, playerName);
        this._session = session;
        return session;
    }
    removeSession(session) {
        const curSession = this.getSession();
        if (curSession && (curSession.symbol === session.symbol)) {
            this._session = null;
        }
        session.stop();
        session.removeFromSessionManager();
    }
}


const sessionManager = new SessionManager();

const iManager = {
    getInstance: () => { return sessionManager; }
};

export default iManager;
