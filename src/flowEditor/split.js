/** * 用于flow之间的split ***/
import $ from 'jquery'
import Split from 'split.js'

const splitMap = new WeakMap()

function collapse (needTransition = true) {
  this.state = true
  this.flag = needTransition
  this.sizes = this.split.getSizes()
  this.split.setSizes([0, 100])
  this.icon.className = 'el-icon-caret-right'
  this.flag = false
}

function expand (needTransition = true) {
  this.state = false
  this.flag = needTransition
  this.split.setSizes(this.sizes)
  this.icon.className = 'el-icon-caret-left'
  this.flag = false
}

function checkInCache (flowEditor, value) {
  if (splitMap.has(flowEditor) === value) return

  throw new Error(value ? 'split mulit' : 'split not created')
}

export default {
  create (flowEditor) {
    checkInCache(flowEditor, false)
    const cache = {
      el: null,
      split: null,
      icon: null,
      sizes: [15, 85],
      collapse,
      expand,
      flag: false,
      state: false
    }
    const split = Split([flowEditor.$refs.palette.$el, flowEditor.$refs.main.$el], {
      sizes: cache.sizes,
      gutterSize: 4,
      gutter (index, direction) {
        const gutter = document.createElement('div')
        gutter.className = `gutter custom-gutter-${direction}`
        const icon = document.createElement('i')
        icon.className = 'el-icon-caret-left'
        icon.style.cursor = 'pointer'
        cache.icon = icon
        cache.el = gutter
        $(icon).on('click.split', e => {
          icon.className === 'el-icon-caret-left'
              ? cache.collapse()
              : cache.expand()
          e.stopPropagation()
        })
        gutter.appendChild(icon)
        return gutter
      },
      elementStyle (dimension, size, gutterSize) {
        size = cache.state ? 0 : size
        return {
          'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
          'transition': `${cache.flag ? '.5' : '0'}s`
        }
      },
      gutterStyle (dimension, gutterSize) {
        return {
          'flex-basis': gutterSize + 'px',
          'width': gutterSize + 'px'
        }
      }
    })
    cache.split = split
    splitMap.set(flowEditor, cache)

      if (flowEditor.maximize) {
          this.collapse(flowEditor)
          this.hide(flowEditor)
      } else if (flowEditor.collapse) {
          this.collapse(flowEditor)
      }

    return split
  },
  destroy (flowEditor) {
    if (splitMap.has(flowEditor)) {
      const cache = splitMap.get(flowEditor)
      $(cache.icon).off('click.split')
      cache.split.destroy()
      splitMap.delete(flowEditor)
      delete cache.collapse
      delete cache.expand
      delete cache.el
    }
  },
  collapse (flowEditor, needTransition = true) {
    checkInCache(flowEditor, true)
    splitMap.get(flowEditor).collapse(needTransition)
  },
  expand (flowEditor, needTransition = true) {
    checkInCache(flowEditor, true)
    splitMap.get(flowEditor).expand(needTransition)
  },
  show (flowEditor) {
    checkInCache(flowEditor, true)
    $(splitMap.get(flowEditor).el).show()
  },
  hide (flowEditor) {
    checkInCache(flowEditor, true)
    $(splitMap.get(flowEditor).el).hide()
  }
}