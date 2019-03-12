export class Target {
  constructor(item) {
    // for (let v in item) {
    //   this[v] = item[v];
    // }
    this.service_ename= this.id = item.tree_node_name
    this.service_name =item.tree_node_desc
    this.tree_p_node_name=item.tree_node_name
    this.service_content={}
    this.service_args=[]
    // this.name=tree_node_desc
    this.type = 0;
    this.versions = Array.of({ name: 0 }, { name: 1 }, { name: 2 });
    this.head = 2;
  }
  get lastest() {
    return this.head === this.versions[this.versions.length - 1].name;
  }
}
