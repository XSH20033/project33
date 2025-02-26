import { _decorator,Node, UITransform, sys, Slider, Toggle} from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameSet')
export class GameSet extends GameBase {

    // 
    @property(Node)
    sliderNode: Node = null;

    // 
    @property(Node)
    valueNode: Node = null;

    openMusicBtn: Node = null;
    closeMusicBtn: Node = null;

    bOpen: boolean = true;

    start() {
        // 
        let value = this.soundMrg.getSoundVolume();
        this.updaSlideValue(value);

        this.openMusicBtn = this.node.getChildByName("box").getChildByName("openMusicBtn");
        this.closeMusicBtn = this.node.getChildByName("box").getChildByName("closeMusicBtn");
        let volume = sys.localStorage.getItem("SoundVolume0920");
        let bOpen = sys.localStorage.getItem("SoundMute0920");
        // 
        if(bOpen){
            let mute = bOpen == "0" ? true : false;
            this.soundMrg.setSoundMute(mute);
            this.bOpen = mute;
        }else{
            let mute = this.soundMrg.getSoundMute();
            this.bOpen = mute;
        }
        if(volume){
            this.soundMrg.setSoundVolume(Number(volume));
            this.updaSlideValue(Number(volume));
        }else{
            let value = this.soundMrg.getSoundVolume();
            this.updaSlideValue(value);
        }
        this.updateOpenSp();
    }

    updaSlideValue(value){
        // 
        this.sliderNode.getComponent(Slider).progress = value;
        let curWidth = Math.floor(234 * value);
        this.valueNode.getComponent(UITransform).width = curWidth;
    }

    onBackBtn(){
        // 
        this.node.destroy();
        // 
        this.soundMrg.playEffect("click");
        // 
        let value = this.sliderNode.getComponent(Slider).progress;
        let bOpen = this.bOpen ? "0" : "1";
        sys.localStorage.setItem("SoundVolume0920", value.toFixed(2));// 
        sys.localStorage.setItem("SoundMute0920", bOpen);
        // 
        this.manager.setGameState(GameState.GAME_START);
    }

    onOpenMusicBtn(){
        // 
        this.soundMrg.playEffect("click");
        // 
        if(this.bOpen == true){
            return;
        }
        this.bOpen = true;
        this.soundMrg.setSoundMute(this.bOpen);
        this.updateOpenSp();
    }

    onCloseMusicBtn(){
        // 
        this.soundMrg.playEffect("click");
        // 
        if(this.bOpen == false){
            return;
        }
        this.bOpen = false;
        this.soundMrg.setSoundMute(this.bOpen);
        this.updateOpenSp();
    }

    updateOpenSp(){
        this.openMusicBtn.getChildByName("check").active = this.bOpen == true ? true : false;
        this.closeMusicBtn.getChildByName("check").active = this.bOpen == false ? true : false;
    }

    onSliderMove(){
        // 
        let value = this.sliderNode.getComponent(Slider).progress;
        let curWidth = Math.floor(234 * value);
        this.valueNode.getComponent(UITransform).width = curWidth;

        // 
        this.soundMrg.setSoundVolume(Number(value.toFixed(2)));
    }
}