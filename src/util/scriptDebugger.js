/**
 * 脚本执行的入口
 * @param {Emitable} emittable 任何实现过$emit的对象，数据放在model中
 */
//假数据
const socket = {
    send(key, data, callback) {
        var flow = [1, 2, 4];
        var func = (index, c) => {
            if (index < flow.length) {
                setTimeout(
                    function () {
                        c(index + 1, "执行完毕:" + data.model[flow[index]].name);
                        func(index + 1, c);
                    }, 1500);
            }
        }
        func(data);
    },
    on(data) {

    }
}

const start = ({ emittable, data }) => {
    //通知editPart开始debug
    emittable.$emit('debug-start');

    try {
        //启动后台的调试
        socket.send("runScriptFlow", data, err => {
            if (err) {
                //发送失败，则终止debug过程
                emittable.$emit('debug-stop', err);
            } else {
                //成功则触发into首个节点
                emittable.$emit('debug-into-node', { index: data.start });
            }
        });

        socket.on(({ index, prevIndex, result, log }) => {
            if (result == -1) {
                //-1表示上一个节点执行异常
                emittable.$emit('debug-error-node', { prevIndex, result, log });
            } else {
                //over上一个节点，并在节点上展示相关信息
                emittable.$emit('debug-over-node', { prevIndex, result, log });
                //into下一个节点
                emittable.$emit('debug-into-node', { index, prevIndex });
            }
        });
    } catch (e) {
        //捕获到异常则终止流程
        emittable.$emit('debug-stop', err);
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