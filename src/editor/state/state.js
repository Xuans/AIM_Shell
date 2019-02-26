import {createData, createLine} from "../util/create-tool";

export default class State {

  input2Config (target) {}

  save (editor, target) {}

  getData (editor) {}


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