export const debugRootPolicy = {
    config: {
        overNode({ index, result, log }) {
            var part = this.getHost().getEditPartById(index);
            if (part) {
                part.$emit("debug-over", { result, log });
            }
        },
        intoNode({ index, prevIndex }) {
            var part = this.getHost().getEditPartById(index);
            if (part) {
                part.$emit("debug-into", { prevIndex });
            }
        },
        errorNode({ index, result, log }) {
            var part = this.getHost().getEditPartById(index);
            if (part) {
                part.$emit("debug-error", { result, log });
            }
        },
        start() {
            this.getHost().$emit("readOnly", 1);
        },
        stop() {
            this.getHost().$emit("readOnly", 0);
            // TODO 把所有children状态清空
            
        },
    },
    activate() {
        console.log("debug policy activate,install listeners");
        this.on("debug-start", this.start);
        this.on("debug-start", this.stop);
        this.on("debug-into-node", this.intoNode);
        this.on("debug-over-node", this.overNode);
        this.on("debug-error-node", this.errorNode);
    },

    deactivate() {
        console.log("debug policy deactivate");
        this.off("debug-start", this.start);
        this.off("debug-start", this.stop);
        this.off("debug-into-node", this.intoNode);
        this.off("debug-over-node", this.overNode);
        this.off("debug-error-node", this.error);
    },
}

export const debugUIPolicy = {
    config: {
        into({ prevIndex }) {
            // console.log(log)
            // this.getHost().model.set('color', result ? 'green' : 'red');
            this.getHost().refresh();
        },
        over({ result, log }) {
            this.getHost().refresh();
        },
        error() {
            this.getHost().refresh();
        }
    },
    activate() {
        console.log("node debug ui active");
        this.getHost().$on("debug-into", this.into);
        this.getHost().$on("debug-over", this.over);
        this.getHost().$on("debug-error", this.error);
    },

    deactivate() {
        this.getHost().$off("debug-into", this.into);
        this.getHost().$off("debug-over", this.over);
        this.getHost().$off("debug-error", this.error);
    }
}
