import {createData, createLine} from "../util/create-tool";

export default class State {
  constructor (target) {
    this.target = target
  }

  input2Config (target) {}

  save (editor, target) {}

  getData (editor) {
    const json = { data: {} ,start:1}
    editor.store.node().each(record => {
      json.data[record.id] = record.data
    })

    return json
  }


  static addDataAndLine(config, dataOfService) {
    let data = []
    let line = []

    for (let [id, dataOfModel] of Object.entries(dataOfService)) {
      data.push(createData({ id }, dataOfModel))

      if (dataOfModel.target) {
        for (let [terminalId, targetId] of Object.entries(dataOfModel.target)) {
          line.push(createLine({
            sourceId: id,
            targetId: targetId,
            exit: terminalId,
            entr: 'n'
          }))
        }
      }
    }

    config.data = data
    config.line = line
  }
}