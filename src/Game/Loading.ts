module Game {
	/**
	 *
	 * @author 
	 *
	 */
	export class Loading extends eui.Component{
    	
        public bardark:eui.Image;
    	
        public barlight: eui.Image;
        
        public moviePanel: eui.Component;
    	
		public constructor() {
            super();
            this.skinName = "Game.LoadingSkin";
		}
		
		public setProcess(now,total){
		    var darkWidth = this.bardark.width;
		    this.barlight.width = now/total * darkWidth;
		}
		
		public addMovie(movie:egret.MovieClip){
            this.moviePanel.addChild(movie);
		}
	}
}
