module Game {
	/**
	 *
	 * @author 
	 *
	 */
	export class Success extends eui.Component{
        public Confirm: eui.Image;
        public TimeLabel: eui.Label;
        public Collision: eui.Label;
        public labelText: eui.Label;
		public constructor() {
            super();
            this.skinName = "Game.SuccessSkin";
		}
		
        protected childrenCreated(): void {
            super.childrenCreated();
            this.Confirm.name = "success";
            this.TimeLabel.text = "0";
            this.Collision.text = "0";
            //this.Confirm.addEventListener(egret.TouchEvent.TOUCH_TAP,this.confirmFunction,this);
        }
        
        public setTimeLabel(second){
            this.TimeLabel.text = second + "";
        }
        
        public setCollision(collision){
            this.Collision.text = collision + "";
        }
        public setLabelText(text){
            this.labelText.text = text + "";
        }
        private confirmFunction(){
            this.parent.removeChild(this);
        }
	}
}
