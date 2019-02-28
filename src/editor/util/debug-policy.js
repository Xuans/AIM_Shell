import Popper from "popper.js";
import 'animate.css';
import $ from 'jquery'

export const debugRootPolicy = {
    config: {
        overNode({ index, result, log }) {
            if(!this.debugging)return;
            console.log("over-node", index);
            var part = this.getHost().getEditPartById(index);
            if (part) {
                part.$emit("debug-over", { result, log });
            }
        },
        intoNode({ index, prevIndex }) {
            if(!this.debugging)return;
            console.log("into-node", index, prevIndex);
            var part = this.getHost().getEditPartById(index);
            if (part) {
                part.$emit("debug-into", { prevIndex });
            }
        },
        errorNode({ index, result, log }) {
            if(!this.debugging)return;
            console.log("errornode", index);
            var part = this.getHost().getEditPartById(index);
            if (part) {
                part.$emit("debug-error", { result, log });
            }
        },
        start() {
            console.log("start");
            this.debugging=true;
            this.cleanChildren();
            this.getHost().$emit("readOnly", 1);

            let children = this.getHost().children;
            if (children)
                for (let i = 0; i < children.length; i++) {
                    children[i].$emit("debug-start-node");
                }
        },
        stop() {
            this.debugging=false;
            console.log("stop");
            this.cleanChildren();
            this.getHost().$emit("readOnly", 0);
            // TODO 把所有children状态清空
        },
        cleanChildren() {
            let children = this.getHost().children;
            if (children)
                for (let i = 0; i < children.length; i++) {
                    children[i].$emit("clean");
                }
        },
    },
    activate() {
        this.debugging=false;
        console.log("debug policy activate,install listeners");
        this.on("debug-start", this.start);
        this.on("debug-stop", this.stop);
        this.on("debug-into-node", this.intoNode);
        this.on("debug-over-node", this.overNode);
        this.on("debug-error-node", this.errorNode);
    },

    deactivate() {
        console.log("debug policy deactivate");
        this.off("debug-start", this.start);
        this.off("debug-stop", this.stop);
        this.off("debug-into-node", this.intoNode);
        this.off("debug-over-node", this.overNode);
        this.off("debug-error-node", this.error);
    },
}
let LogPanel = $AG.Handle.extend({
    tagName: 'g'
});
export const debugUIPolicy = {
    config: {

        addLogPanel(log) {
            if (this.handles == null) {
                this.handles = [];
            }

            let toolong = log.duration > 1000;

            let pop1 = document.createElement('div');
            pop1.innerHTML = `<div  
            style='pointer-events:none;
            padding:10px 10px;
            font-size:.8rem;
            background-color:white;
            border-radius:15px 15px;
            box-shadow:0 0 5px black;
            width:200px;
            overflow-y:auto'>
            
            ${log.time} 
               <span style='color:${toolong ? 'red' : 'green'}'>${toolong ? (log.duration / 1000) + 's' : log.duration + 'ms'}</span>
               <br> <xmp style="white-space:normal;">${log.log}</xmp></div>`;
            pop1.style['pointer-events'] = 'none';
            pop1.style['margin'] = '10px 10px';
            pop1.classList.add('animated', 'fadeIn');

            const $pop1=$(pop1);

            $(this.getHost().getFigure().domContainer())
                    .closest('.flow-canvas')
                    .append($pop1);
                

            //document.body.appendChild();
            var pi = new Popper(this.getHost().getFigure().owner, pop1, {
                onCreate: data => {
                    console.log(data)
                },
                placement: 'right',
                onUpdate: data => {
                }
            });
            let panel = new LogPanel(this.getHost());

            panel.refreshLocation = figure => {
                pi.update();
            }
            let dip = panel.dispose;
            panel.dispose = () => {
                pi.destroy();
                $pop1.remove();
                dip.call(panel);
                console.log("dispose");
            }
            this.handles.push(panel);
            for (let i = 0; i < this.handles.length; i++) {
                this.getHandleLayer().addChild(this.handles[i]);
            }

        },
        removeLogPanel() {
            if (this.handles)
                for (let i = 0; i < this.handles.length; i++) {
                    this.getHandleLayer().removeChild(this.handles[i]);
                }
            this.handles = null;
        },
        into({ prevIndex }) {
            this.getHost().refresh();
            $(this.getHost().getFigure().owner).animate({
                opacity: 1
            })
            
            this.getHost().getFigure().fire('handler', handler => {
                handler.setOpacity(1);
            });
        },
        over({ result, log }) {
            this.getHost().refresh();
            if (log) {
                this.addLogPanel(log);
            }

            let conns = this.getHost().sConns;
            if (conns) {
                //渐进线效果
                for (let i = 0; i < conns.length; i++) {
                    if (result == conns[i].model.get('exit')) {
                        conns[i].getFigure().addClass('dashline');
                        $(conns[i].getFigure().owner).animate({
                            opacity: 1,
                            'stroke-dashoffset': 0,
                        }, () => {
                            conns[i].getFigure().setStyle({
                                'stroke-dashoffset': 200,
                            });
                            conns[i].getFigure().removeClass('dashline');
                        })
                        break;
                    }

                }
            }

            //修改执行颜色
            this.getHost().model.set('color', result ? 'green' : 'red'); this.getHost().refresh();
        },
        error() {
            this.getHost().refresh();
        },
        clean() {
            this.getHost().model.set('color', 0);
            this.getHost().refresh();
            this.removeLogPanel();

            //回复透明度
            let conns = this.getHost().sConns;
            if (conns) {
                for (let i = 0; i < conns.length; i++) {
                    conns[i].getFigure().setOpacity(1);
                    //停止正在进行的动画
                    $(conns[i].getFigure().owner).stop();
                }
            } 
            this.getHost().getFigure().setOpacity(1);
            $(this.getHost().getFigure().owner).stop();
            this.getHost().getFigure().fire('handler', handler => {
                handler.setOpacity(1);
            });
        },
        start() {
            let conns = this.getHost().sConns;
            if (conns) {
                for (let i = 0; i < conns.length; i++) {
                    conns[i].getFigure().setOpacity(.1);
                }
            }
            this.getHost().getFigure().setOpacity(.1);
            this.getHost().getFigure().fire('handler', handler => {
                handler.setOpacity(.1);
            });
        }
    },
    activate() {
        this.color = this.getHost().model.get('color');
        this.getHost().$on("debug-into", this.into);
        this.getHost().$on("debug-over", this.over);
        this.getHost().$on("debug-error", this.error);
        this.getHost().$on("clean", this.clean);
        this.getHost().$on("debug-start-node", this.start);
    },

    deactivate() {
        console.log("node debug ui deactivate");
        this.getHost().$off("debug-into", this.into);
        this.getHost().$off("clean", this.clean);
        this.getHost().$off("debug-over", this.over);
        this.getHost().$off("debug-error", this.error);
        this.getHost().$off("debug-start-node", this.start);
        if (this.handle)
            this.getHandleLayer().removeChild(this.handle);
        this.clean();
    }
}
