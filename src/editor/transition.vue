<template>
    <span>
        <transition name="el-zoom-in-center"
                    @after-leave="afterLeaveC">
            <div ref="control"
                 key="control"
                 v-show="visible && state.colltrol"
                 class="custom-aside custom-aside--control"
                 @click="handleOfExpand">
                <el-button circle
                           size="medium"
                           type="primary"
                           icon="el-icon-d-arrow-left"
                           style="transform: translateY(-40px)"
                           @click="handleOfExpand">
                </el-button>
                <span>配置<br/>(TAB)</span>
            </div>
        </transition>

        <transition name="custom" @after-leave="afterLeaveE"
                                  @before-enter="beforeEnter">
            <el-container ref="editor"
                          key="editor"
                          v-show="visible && state.editor"
                          class="custom-aside custom-aside--editor">
                <el-aside ref="split" width="4px" class="gutter gutter-horizontal" style="background-color: rgb(206, 206, 206);box-shadow:  0px 3px 3px 3px #888888"></el-aside>

                <el-container>
<!--                    <el-header height="3rem" class="custom-aside&#45;&#45;header">
                        <span>{{desp}}</span>
                    </el-header>-->

                    <slot><!-- flowEditor --></slot>

                    <el-button circle
                               size="medium"
                               type="primary"
                               icon="el-icon-d-arrow-right"
                               class="custom-back-btn"
                               @click="handleOfCollapse">
                    </el-button>
                </el-container>
            </el-container>
        </transition>
    </span>
</template>

<script>
  import $ from 'jquery'

  export default {
    props: {
      visible: Boolean,
      expand: {
        type: Boolean,
        default: false
      },
      desp: String
    },
    data () {
      return {
        state: {
          colltrol: !this.expand,
          editor: this.expand
        }
      }
    },
    watch: {
      expand (val) {
        if (val) {
          this.state.colltrol ? this.state.colltrol = false : this.state.editor = true
        } else {
          this.state.editor ? this.state.editor = false : this.state.colltrol = true
        }
      }
    },
    mounted () {
      let _x, isDrag, offset0
      let width = $(this.$refs.editor.$el).css('left')
      let offset = 0

      $(this.$refs.split.$el).mousedown((e) => {
        isDrag = true
        _x = e.pageX
        offset0 = offset
      })

      $(document).on(`mousemove.resize`, e => {
        if (isDrag) {
          let tempOff = offset0 + e.pageX - _x

          if (tempOff > 0 && tempOff <= 400) {
            offset = tempOff
            $(this.$refs.editor.$el).css('left', `calc(${width} + ${tempOff}px)`)
          }
        }
      }).on(`mouseup.resize`, () => {
        isDrag = false
      })
    },
    beforeDestroy () {
      $(document).off('.resize')
      // this.split.destroy()
    },
    methods: {
      handleOfExpand () {
        this.$emit('update:expand', true)
        this.$emit('click-control')
      },
      handleOfCollapse () {
        this.$emit('update:expand', false)
        this.$emit('click-back')
      },
      beforeEnter (el) {
        this.$emit('editor-open', el)
      },
      afterLeaveC (el) {
        if (this.expand) {
          this.state.editor = true
        }
      },
      afterLeaveE () {
        if (!this.expand) {
          this.state.colltrol = true
        }
        this.$emit('editor-closed')
      }
    }
  }
</script>

<style scoped>
    .custom-aside {
        z-index: 50;
        top: 42px;
        bottom: 0px;
        right: 0px;
        position: absolute;
        border: solid 1px #ebebeb;
        border-radius: 2px;
    }

    .custom-aside--control {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        border-radius: 2px;
        border: 1px solid #dcdfe6;
        background-color: #fdfdfe;
        color: #2d343e;
    }

    .custom-aside--editor {
        left: 65%;
    }

    .custom-aside--control:hover {
        color: teal;
        border-color: #b3d9d9;
        background-color: #e6f2f2;
    }

    .custom-aside--header {
        background-color: white;
        border-bottom: 1px solid lightgrey;
        color: #606266;
        line-height: 2.7rem;
    }

    .custom-back-btn {
        z-index: 51;
        position: absolute;
        bottom: 5px;
        left: 5px;
    }

    .custom-enter-active {
        transition: all .5s;
    }
    .custom-leave-active {
        transition: all .5s;
    }
    .custom-enter, .custom-leave-to {
        opacity: 0;
        transform: translateX(75%);
    }

</style>
