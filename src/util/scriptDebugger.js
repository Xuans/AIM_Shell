
/**
 * 脚本代码调试器
 */
const run = (data, callback) => {
    //TODO 假数据
    
    var flow = [1,2,4];

    var func = (index, c) => {
        if (index < flow.length) {
            setTimeout(
                function () {
                    c(index + 1,"执行完毕:"+data.data[flow[index]].name);
                    func(index + 1, c);
                }, 1500);
        }
    }
    func(0, callback, func);
}
const scriptDebugger = (function () {
    return {
        run
    }
}());

export default scriptDebugger;