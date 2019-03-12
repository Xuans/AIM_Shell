//测试
const test=()=>{
    app.shellEditorApi.getTreeNodeLoop([{tree_class:'0001','tree_node_name':''}]).then(resp=>console.log('0001',resp));
    app.shellEditorApi.getTreeNodeLoop([{tree_class:'0002','tree_node_name':''}]).then(resp=>console.log('0002',resp));
    app.shellEditorApi.getTreeNodeLoop([{tree_class:'0003','tree_node_name':''}]).then(resp=>console.log('0003',resp));
    app.shellEditorApi.getTreeNodeLoop([{tree_class:'0011','tree_node_name':''}]).then(resp=>console.log('0011',resp));
}

window.test=test;