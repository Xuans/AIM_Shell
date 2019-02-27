
/**
 * 脚本执行的入口
 * @param {Emitable} emittable 任何实现过$emit的对象，数据放在model中
 */
//假数据
const socket = {
    listener: null,
    send(key, data, flow, onError) {
        onError();
        var func = (index, c) => {
            let log = flow.progress[index];
            if (log) {
                setTimeout(
                    function () {
                        console.log("当前节点" + index)
                        // c({ index: (index + 1), prevIndex: index, result: 1, log: "执行完毕:" + data.data[flow[index]].name });
                        let node = data.data[index];
                        if (node.target) {
                            let i = node.target[log.result];
                            console.log("下一个节点", i, index);
                            c({ index: i, prevIndex: index, result: log.result, log });
                            func(i, c);
                        } else {
                            // console.error(index)
                            c({ index: -1, prevIndex: index, result: log.result, log });
                        }
                    },600);
            }
        }
        func(data.start, this.listener);
    },
    on(listener) {
        this.listener = listener;
    }
}

let current = -1;
let unlinkedGroup = {};
const intoNextNode = ({ index, prevIndex }) => {

}
const overPrevNode = ({ index, prevIndex, result, log }) => {

    if (current == -1 || current == prevIndex) {
        //验证节点顺序，current=-1说明index为start节点，current==prevIndex说明index为current的后置节点
        //over上一个节点，并在节点上展示相关信息
        emittable.$emit('debug-over-node', { prevIndex, result, log });
        current = index;

        //检查unlinkGroup中有无为执行的后续节点
        let c;
        if (c = unlinkedGroup[current]) {
            //删除缓存
            delete unlinkedGroup[current];
            //迅速执行into和over
            intoNextNode(c);
            overPrevNode(c);
        }
    } else {
        unlinkedGroup.prevIndex = { index, prevIndex, result, log };
    }
    for (var i = 0; i < queue.lenght; i++) {
        queue[i].index == prevIndex;
    }
}
const start = (emittable, data, flow) => {
    //通知editPart开始debug
    emittable.$emit('debug-start');

    try {
        //当前执行中的节点

        socket.on(({ index, prevIndex, result, log }) => {
            if (result == -1) {
                //-1表示上一个节点执行异常
                emittable.$emit('debug-error-node', { index: prevIndex, result, log });
            } else {

                // overPrev({ index, prevIndex, result, log });
                // intoNext({ index, prevIndex, result, log });
                emittable.$emit('debug-over-node', { index: prevIndex, result, log });
                //into下一个节点
                emittable.$emit('debug-into-node', { index, prevIndex });
            }
        });

        //启动后台的调试
        socket.send("runScriptFlow", data, flow, err => {
            if (err) {
                //发送失败，则终止debug过程
                emittable.$emit('debug-stop', err);
            } else {
                //成功则触发into首个节点
                emittable.$emit('debug-into-node', { index: data.start });
            }
        });

    } catch (e) {
        console.log(e)
        //捕获到异常则终止流程
        emittable.$emit('debug-stop', e);
    }
}
const stop = emittable => {
    emittable.$emit('debug-stop');
}
// const run = (data, callback) => {
//     //TODO 假数据
//     var flow = [1, 2, 4];
//     editPart.$emit('debug-into-node', { index });

//     socket.send
//     var func = (index, c) => {
//         if (index < flow.length) {
//             setTimeout(
//                 function () {
//                     c(index + 1, "执行完毕:" + data[flow[index]].name);
//                     func(index + 1, c);
//                 }, 1500);
//         }
//     }
//     func(0, callback, func);
// }
const scriptDebugger = (function () {
    return {
        start, stop
    }
}());

export default scriptDebugger;