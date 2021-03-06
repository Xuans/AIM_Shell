<template>
  <el-container :class="{'cant-edit': !canEdit}" style="height: 100%">
    <el-aside ref="palette" width="0px" class="flow-palette">
      <slot name="palette"></slot>
    </el-aside>

    <el-container ref="main" direction="vertical" style="overflow:none;">
      <el-main style="overflow:none;position:relative;padding:0;">
        <div ref="canvas" class="flow-canvas"></div>
        <slot name="canvas"></slot>
      </el-main>

      <slot name="canvasUnder"></slot>
    </el-container>
  </el-container>
</template>

<style>
.cant-edit {
  pointer-events: none;
  opacity: 0.6;
}

.flow-palette {
  background-color: white;
}

.flow-canvas {
  padding: 0px;
  position: relative;
  background-color: #f1f1f4;
  overflow: auto;
  width: 100%;
  height: 100%;
}

.gutter.custom-gutter-horizontal {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #cecece;
  cursor: col-resize;
}
</style>

<script type="text/javascript">
import $ from "jquery";
import KeyManager from "../util/keyManager";
import Split from "./split";

const SHOW_MENU = "showmenu";
const HIDE_MENU = "hidemenu";
const INIT = "init";
const COMMAND = "command";

// TODO
const FlowConstruction = (function() {
  return $AG.extend({
    background: "#f1f1f4",
    createCanvas(id) {
      $(`#${id}`).css("background-color", this.background);
      return new $AG.SVG(id);
    }
  });
})();

export default {
  name: "flowEditor",

  provide() {
    return {
      flowEditor: this
    };
  },

  props: {
    editorExtend: Object,
    canEdit: {
      type: Boolean,
      default: true
    },
    collapse: {
      type: Boolean,
      default: false
    },
    maximize: {
      type: Boolean,
      default: false
    },
    config: {
      required: true
    },
    eventsOnEditor: Object,
    autofocus: {
      type: Boolean,
      default: false
    },
    keyManager: {
      default() {
        return new KeyManager("global");
      }
    }
  },

  data() {
    return {
      editor: null
    };
  },

  watch: {
    config(newConfig) {
      this.detachEditor();
      this.initEditor(newConfig);
    },
    collapse(val) {
      val ? Split.collapse(this) : Split.expand(this);
    },
    maximize(val) {
      if (val) {
        if (!this.collapse) Split.collapse(this);
        Split.hide(this);
      } else {
        Split.show(this);
        if (!this.collapse) Split.expand(this);
      }
    }
  },

  computed: {
    canvas() {
      return this.editor ? this.editor.canvas : null;
    },
    uuid() {
      return this.editor ? this.editor.storeId : null;
    },
    EditorConstruction() {
      return this.editorExtend
        ? FlowConstruction(this.editorExtend)
        : FlowConstruction;
    },
    editorId() {
      return this.config == null ? "" : this.config.id;
    }
  },

  mounted() {
    console.log("editor mounted", this.config);
    this.init();
  },
  deactivated() {
    console.log("flowEditor deactivated");
  },
  updated() {
    let canvas = $(this.$refs.canvas);
    if (this.getSvg() && !canvas.is(":has(svg)")) {
      // canvas.append(this.getSvg());
      // this.replaceEditor(this.editor, true);
      this.dispose();
      this.init();
    }
  },
  beforeDestroy() {
    console.log("flowEditor beforeDestroy");
    this.dispose();
  },

  methods: {
    init() {
      this.initEditor(this.config);
      this.activateKeyManager();
      this.activeAutofocus();
      Split.create(this);
    },
    dispose() {
      Split.destroy(this);
      this.deactivateAutofocus();
      this.deactivateKeyManager();
      if (this.editor) {
        this.editor.dispose();
        this.editor = null;
      }
    },
    initEditor(config) {
      this.$refs.canvas.setAttribute("id", this.editorId);

      this.editor = new this.EditorConstruction($.extend(true, {}, config));
      this.onEditor(this.eventsOnEditor);
      this.$emit(INIT, this.editor);
      this.editor.doSave = done => this.$emit("save", this.editor, done);
      this.initContextMenu();
      this.initCommandListener();
    },

    initContextMenu() {
      if (this.editor == null) return;

      if (
        this.$listeners[SHOW_MENU] &&
        typeof this.$listeners[SHOW_MENU] === "function"
      )
        this.editor.showContextMenu = this.showMenu;

      if (
        this.$listeners[HIDE_MENU] &&
        typeof this.$listeners[HIDE_MENU] === "function"
      )
        this.editor.hideContextMenu = this.hideMenu;
    },

    initCommandListener() {
      if (this.editor.cmdStack) {
        let self = this;
        this.editor.cmdStack.addCommandStackEventListener(
          new $AG.Listener(event => self.$emit(COMMAND, event))
        );
      }
    },

    /* 注册快捷键 */
    activateKeyManager() {
      const host = this;

      this.keyManager.watchPage(this.$el, {
        keydown(e) {
          const editor = host.editor;
          if (editor != null) {
            editor.canvas.dispatcher.dispatchKeyDown(e);
            const actions = editor.actionRegistry.getActions("*", editor, {
              event: e
            });
            if (actions.length > 0) return false;
          }
        },
        keyup(e) {
          const editor = host.editor;
          if (editor != null) {
            editor.canvas.dispatcher.dispatchKeyUp(e);
            const actions = editor.actionRegistry.getActions("*", editor, {
              event: e
            });
            if (actions.length > 0) return false;
          }
        }
      });
      this.keyManager.active(this.$el);
    },

    deactivateKeyManager() {
      this.keyManager.unwatchPage(this.$el);
    },

    activeAutofocus() {
      if (this.autofocus) {
        let isfocus = false;

        $(document).on(
          `click.${this.editorId}`,
          { host: this },
          ({ data: { host } }) => {
            isfocus ? host.focus() : host.blur();
            isfocus = false;
          }
        );

        $(this.$refs.canvas).click(e => {
          isfocus = true;
        });
      } else {
        $(this.$refs.canvas).click(e => {
          this.focus();
        });
      }
    },

    deactivateAutofocus() {
      if (this.autofocus) {
        $(document).off(`click.${this.editorId}`);
      }
      $(this.$refs.canvas).off("click", "**");
    },

    isDirty() {
      return this.editor.isDirty();
    },

    focus() {
      this.keyManager.active(this.$el);
      this.$emit("focus", this.editor);
    },

    blur() {
      this.keyManager.active(null);
      this.$emit("blur", this.editor);
    },

    showMenu() {
      let items = [];
      let types = Array.of(0, 1, 2);
      for (let type of types) {
        let length = items.length;
        let actions = this.editor.actionRegistry.getActions(type, this.editor);
        for (let action of actions) {
          if (action.name != null) {
            let item = {
              name: action.name,
              type: "item",
              handler() {
                action.run();
              }
            };

            if (action.key != null) {
              item.shortcutKey = action.key;
            }
            items.push(item);
          }
        }

        if (length > 0 && items.length > length) {
          items.splice(length, 0, { type: "separator" });
        }
      }

      this.$emit(SHOW_MENU, items);
    },

    hideMenu() {
      this.$emit(HIDE_MENU);
    },

    detachEditor() {
      console.log("detachEditor", this.config);
      if (this.editor) {
        const editor = this.editor;
        if (editor != null) {
          $(this.getSvg()).detach();
          this.editor = null;
        }
        return editor;
      }
    },

    replaceEditor(newEditor, force = false) {
      console.log("replaceEditor", newEditor);
      if (!force && newEditor === this.editor) return;
      if ($AG.isEditor(newEditor)) {
        let old, oldSvg, newSvg;

        old = this.editor;
        oldSvg = this.getSvg();

        this.editor = newEditor;
        newSvg = this.getSvg();

        oldSvg != null
          ? $(oldSvg).replaceWith(newSvg)
          : $(this.$refs.canvas).append(newSvg);
        if (oldSvg)
          newEditor.style({
            background: newEditor.config.background
          });

        this.$emit("change:editor", this.editor, old);

        return old;
      }
    },

    onEditor(event) {
      if (event)
        for (let [key, fn] of Object.entries(event))
          this.editor.rootEditPart.$on(key, fn);
    },

    getSelection() {
      return this.editor != null ? this.editor.rootEditPart.selection : null;
    },

    getSvg() {
      return this.editor != null ? this.editor.canvas.owner : null;
    }
  }
};
</script>
