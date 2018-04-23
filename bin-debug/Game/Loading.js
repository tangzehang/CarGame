var Game;
(function (Game) {
    /**
     *
     * @author
     *
     */
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading() {
            _super.call(this);
            this.skinName = "Game.LoadingSkin";
        }
        var d = __define,c=Loading,p=c.prototype;
        p.setProcess = function (now, total) {
            var darkWidth = this.bardark.width;
            this.barlight.width = now / total * darkWidth;
        };
        p.addMovie = function (movie) {
            this.moviePanel.addChild(movie);
        };
        return Loading;
    }(eui.Component));
    Game.Loading = Loading;
    egret.registerClass(Loading,'Game.Loading');
})(Game || (Game = {}));
//# sourceMappingURL=Loading.js.map