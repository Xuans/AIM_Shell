export class Target {
  constructor(item) {
    this.service_ename= this.service_id= this.id = item.tree_node_name
    this.service_name =item.tree_node_desc
    this.tree_p_node_name=item.tree_p_node_name
    this.service_content={}
    this.service_args={}
    this.service_doc=""
    this.create_user="未知"
    // this.name=tree_node_desc
    this.type = 0;
    this.versions = Array.of({ name: 0 }, { name: 1 }, { name: 2 });
    this.head = 2;
  }

  parse () {
    return this.parseContent().parseArgs()
  }

  parseContent() {
    try {
      this.service_content = JSON.parse(this.service_content);
    } catch (e) {
      console.error('init target.service_content', this.service_content);
      this.service_content = {
        data: {}
      };
    }

    return this.service_content
  }

  parseArgs() {
    if (!this.service_args) {
      this.service_args = JSON.parse(this.service_args);
    } else
      this.service_args = {};

    return this
  }

  toBeNotReady () {
    this.ready = false

    return this
  }

  assgin (target) {
    return Object.assign(this, target)
  }

  get lastest() {
    return this.head === this.versions[this.versions.length - 1].name;
  }

  static makeNull () {
    return new Target({tree_node_name: 1})
  }
}
/* class Target {
  constructor (item,version) {
    this.service_ename= this.service_id= this.id = item.tree_node_name
    this.service_name =item.tree_node_desc
    this.tree_p_node_name=item.tree_p_node_name
    this.service_content={}
    this.service_args={}
    this.service_doc=""
    this.create_user="未知"
    // this.name=tree_node_desc
    this.type = 0;
    this.versions = Array.of({ name: 0 }, { name: 1 }, { name: 2 });
    this.head = 0;
  }

  cloneByVersion (version) {
    let target = new Target(this.item,version)

    target.head = version.name

    return target
  }

  get lastest () {
    return this.head === this.versions[this.versions.length - 1].name
  }
}  */
export class VersionTarget extends Target {
  cloneByVersion (version) {
    let target = new Target(this.item,version)

    target.head = version.name

    return target
  }
}
