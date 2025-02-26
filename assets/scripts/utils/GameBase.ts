import { _decorator, Component, EPhysics2DDrawFlags, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "./GameManager";
import { EventCenter } from "./EventCenter";
import { SoundMgr } from "./SoundMgr";

@ccclass('GameBase')
export class GameBase extends Component {
    manager: GameManager = null;
    eventCenter: EventCenter = null;
    soundMrg: SoundMgr = null;

    protected onLoad(): void {
        // game - manager
        this.manager = GameManager.Instance;
        // game - event
        this.eventCenter = EventCenter.Instance;
        // game -sound
        this.soundMrg = SoundMgr.Instance;
        // init
        this.init();
        // game - FPS
        // cc.game.setFrameRate(30);
    }

    init() {

    }
}

