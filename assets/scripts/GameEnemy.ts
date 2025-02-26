import { Enum, Label, ProgressBar, Node, v3, Vec3, _decorator, Sprite, Color} from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

// 
const enemyEnum = Enum({
    enemy0: 0,//
    enemy1: 1,//
    enemy2: 2,//
    enemy3: 3,//
});

@ccclass('GameEnemy')
export class GameEnemy extends GameBase {
    @property({ type: Enum(enemyEnum), displayName: '' })
    enemyIndex = enemyEnum.enemy0;

    move_speed: number = -2;
    bMove: boolean = true;
    bAtkHome: boolean = false;
    min_pos_x: number = 80;

    atkDt: number = 2;
    curDt: number = 0;

    curLife: number = 0;
    maxLife: number = 0;
    lifeBar: ProgressBar = null;

    addGold: number = 0;
    addGoldArr: number[] = [5, 10, 20];

    start() {
        this.lifeBar = this.node.getChildByName("lifeBar").getComponent(ProgressBar);
        this.lifeBar.progress = 1;
        this.addGold = this.addGoldArr[this.enemyIndex];
        //
        this.updateEnemyView(1);
        //
        this.eventCenter.AddListener("EnemyAtkHome",this.enemyAtkHome,this);
        this.eventCenter.AddListener("OnHurtEnemyLife",this.onHurtEnemyLife,this);
    }

    onDestroy(){
        this.eventCenter.RemoveListener("EnemyAtkHome",this.enemyAtkHome,this);
        this.eventCenter.RemoveListener("OnHurtEnemyLife",this.onHurtEnemyLife,this);
    }

    update(deltaTime){
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }

        if(this.bAtkHome){
            let pos = this.node.position;
            let moveX = pos.x + this.move_speed;
            let moveY = pos.y;
            this.node.position = v3(moveX, moveY);
            return;
        }

        if(this.bMove){
            let pos = this.node.position;
            let moveX = pos.x + this.move_speed;
            let moveY = pos.y;
            if(moveX < this.min_pos_x){
                moveX = this.min_pos_x;
                this.bMove = false;
            }
            this.node.position = v3(moveX, moveY);
        }else{
            this.curDt -= deltaTime;
            if(this.curDt <= 0){
                this.curDt = this.atkDt;
                //
                this.updateEnemyView(0);
                this.onEnemyAtk();
            }
        }
    }

    updateEnemyView(state){
        let body0 = this.node.getChildByName("body0");
        let body1 = this.node.getChildByName("body1");
        body0.active = false;
        body1.active = false;
        if(state == 0){
            body0.active = true;
        }else{
            body1.active = true;
        }
    }

    setEnemyLife(life){
        this.curLife = life;
        this.maxLife = life;
    }

    onHurtEnemyLife(life){
        this.curLife -= life;
        if(this.curLife <= 0){
            this.lifeBar.progress = 0;
            this.node.destroy();
            this.eventCenter.dispatchEvent("AddFightGold", this.addGold);
        }else{
            let lifeRate = Number((this.curLife / this.maxLife).toFixed(2));
            this.lifeBar.progress = lifeRate;
        }
    }

    onEnemyAtk(){
        let pos = this.node.position;
        let index = this.enemyIndex;
        this.eventCenter.dispatchEvent("OnCreateEnemyAtk", [index, pos]);
    }

    enemyAtkHome(){
        this.bAtkHome = true;
        this.updateEnemyView(1);
    }
}


