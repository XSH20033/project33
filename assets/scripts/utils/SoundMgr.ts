import { _decorator, Component, AudioClip, loader, AudioSource, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundMgr')
export class SoundMgr extends Component {
    sounds:{[key:number]:any} = {};
    soundList: string[] = ["sound/bg.mp3", "sound/click.mp3", "sound/boom.mp3", "sound/fight.mp3"]
    soundNameList: string[] = ["bg","click","boom", "fight"]

    /***/
    private _persistRootNode: Node = null;
    //
    private _music: AudioSource = null;
    //
    private _sounds: AudioSource[] = [];
    /**bgm  0:open 1:close*/
    private _music_muted: number = 0;
    /**sound 0:open 1:close*/
    private _sound_muted: number = 0;
    /**bgm*/
    private _music_volume: number = 1;
    /**sound*/
    private _sound_volume: number = 1;
    /***/
    private cur_music:string = '';

    private static _instance: SoundMgr;//
    /***/
    public static get Instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new SoundMgr();
        return this._instance;
    }

    init () {
        if (this._persistRootNode) return; //
        this._persistRootNode = find("Canvas");

        this._music = this._persistRootNode.addComponent(AudioSource);
        //
        this._music.volume = this._music_volume;
        //
        this._music.volume = this._music_muted == 1 ? 0 : this._music_volume;
        this._music_muted = 0;
        this._sound_muted = 0;
        //
        for (let i = 0; i < this.soundList.length; i++) {
            this._sounds[i] = this._persistRootNode.addComponent(AudioSource);
            this._sounds[i].volume = this._sound_volume;
            this._sounds[i].volume = this._sound_muted == 1 ? 0 : this._sound_volume;
        }
    }

    loadSounds(){
        for(let i = 0; i < this.soundList.length; i++){
            let path = this.soundList[i];
            loader.loadRes(path,AudioClip,(err, audioClip)=> {
                if(err){
                    return;
                }
                // console.log("load_music" + path);
                this.addSound(this.soundNameList[i],audioClip);
                if(this.soundNameList[i] == "bg"){
                    // 
                    this.playMusic("bg",true);
                }
            })
        }
    }

    addSound(key:string, clip:AudioClip) {
        this.sounds[key] = clip;
    }

    playMusic(music:string,isLoop:boolean) {
        if(this.cur_music == music){
            return;
        }
        let musicState = this._music.getComponent(AudioSource).state;
        if(musicState == AudioSource.AudioState.PLAYING){
            this._music.stop();
        }
        // get audioClip
        let clip = this.sounds[music];
        // reset
        this._music.clip = clip;
        this._music.loop = isLoop;
        this._music.play();
    }

    playEffect(music:string,isLoop:boolean = false) {
        // get audioClip
        let clip = this.sounds[music];
        let index = this.getSoundIndex(music);
        if(!this._sounds[index]){
            // console.log("Fail Find AudioSource");
            return;
        }
        // reset
        this._sounds[index].clip = null;
        this._sounds[index].clip = clip;
        this._sounds[index].loop = isLoop;
        this._sounds[index].play();
    }

    setSoundVolume(volume: number){
        // 
        this._music_volume = volume;
        this._sound_volume = volume;
        // 
        if(this._sound_muted == 1){
            return;
        }
        // update
        this._music.volume = volume;
        for (let i = 0; i < this._sounds.length; i++) {
            this._sounds[i].volume = volume;
        }
    }

    setSoundMute(bOpen: boolean){
        // 
        this._music_muted = bOpen ? 0 : 1;
        this._sound_muted = bOpen ? 0 : 1;
        // update
        this._music.volume = bOpen ? this._music_volume : 0;
        for (let i = 0; i < this._sounds.length; i++) {
            this._sounds[i].volume = bOpen ? this._sound_volume : 0;
        }
    }

    getSoundVolume(){
        return this._music_volume;
    }

    getSoundMute(){
        return this._music_muted == 0 ? true : false;
    }

    getSoundIndex(soundName:string){
        if(!soundName){
            return null;
        }
        for(let i in this.soundNameList){
            let value = this.soundNameList[i];
            if(value == soundName){
                return i;
            }
        }
        return null;
    }

}


