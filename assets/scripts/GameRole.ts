import { _decorator, Enum, v3, Node, view, ProgressBar, UITransform} from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

// 
const roleEnum = Enum({
    role0: 0,//
    role1: 1,//
    role2: 2,//
    role3: 3,//
});

@ccclass('GameRole')
export class GameRole extends GameBase {
    @property({ type: Enum(roleEnum), displayName: '' })
    roleIndex = roleEnum.role0;

    move_speed: number = 2;
    bMove: boolean = true;
    max_pos_x: number = -80;

    atkDt: number = 2;
    curDt: number = 0;

    hpValue: number[] = [10, 40, 70];
    addHp: number = 10;
    curLife: number = 0;
    maxLife: number = 0;
    lifeBar: ProgressBar = null;

    start () {
        this.lifeBar = this.node.getChildByName("lifeBar").getComponent(ProgressBar);
        this.updateRoleView(1);
        this.initRoleData();
        this.eventCenter.AddListener("OnAddRolelife",this.onAddRolelife,this);
    }

    onDestroy(){
        this.eventCenter.RemoveListener("OnAddRolelife",this.onAddRolelife,this);
    }

    initRoleData(){
        let roleLvData = this.manager.getRoleLvData();
        let roleLv = roleLvData[this.roleIndex];

        this.curLife = roleLv * this.addHp + this.hpValue[this.roleIndex];
        this.maxLife = roleLv * this.addHp + this.hpValue[this.roleIndex];
        this.lifeBar.progress = 1;
    }

    update(deltaTime: number) {
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }

        if(this.bMove){
            let pos = this.node.position;
            let moveX = pos.x + this.move_speed;
            let moveY = pos.y;
            if(moveX > this.max_pos_x){
                moveX = this.max_pos_x;
                this.bMove = false;
            }
            this.node.position = v3(moveX, moveY);
        }else{
            this.curDt -= deltaTime;
            if(this.curDt <= 0){
                this.curDt = this.atkDt;
                //
                this.updateRoleView(0);
                this.onRoleAtk();
            }
        }
    }

    updateRoleView(state){
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

    onAddRolelife(life){
        this.curLife += life;
        if(this.curLife > this.maxLife){
            this.curLife = this.maxLife;
            this.lifeBar.progress = 1;
        }else{
            let lifeRate = Number((this.curLife / this.maxLife).toFixed(2));
            this.lifeBar.progress = lifeRate;
        }
    }

    onHurtRoleLife(life){
        this.curLife -= life;
        if(this.curLife <= 0){
            this.lifeBar.progress = 0;
            this.node.destroy();
            this.eventCenter.dispatchEvent("EnemyAtkHome", null);
        }else{
            let lifeRate = Number((this.curLife / this.maxLife).toFixed(2));
            this.lifeBar.progress = lifeRate;
        }
    }

    onRoleAtk(){
        let pos = this.node.position;
        let index = this.roleIndex;
        this.eventCenter.dispatchEvent("OnCreateRoleAtk", [index, pos]);
    }
}


