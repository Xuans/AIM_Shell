export default function genJson (editor) {
  const json = { data: {} }
  const targetSet = new Set()

  editor.store.node().each(record => {
    json.data[record.id] = record.data

    if (record.data.target) {
      for (let target of Object.values(record.data.target)) {
        targetSet.add(target)
      }
    }
  })

  for (let id of Object.keys(json.data)) {
    if (!targetSet.has(id)) {
      json.start = id
      break
    }
  }

  return json
}