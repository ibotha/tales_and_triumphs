<template>
  <div class="editor">
    <div class="controls">
      <div
        :class="'btn ' + (editor?.isActive('bold') ? 'active' : '')"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <i class="fa fa-bold" aria-hidden="true"></i>
      </div>
      <div
        class="btn"
        @click="showHeaderOptions = !showHeaderOptions"
        style="position: relative"
      >
        <i class="fa fa-header" aria-hidden="true"></i>
        <div v-if="showHeaderOptions" style="position: absolute; z-index: 1">
          <div
            class="btn"
            @click="editor?.chain().focus().setHeading({ level: 1 }).run()"
          >
            1
          </div>
          <div
            class="btn"
            @click="editor?.chain().focus().setHeading({ level: 2 }).run()"
          >
            2
          </div>
          <div
            class="btn"
            @click="editor?.chain().focus().setHeading({ level: 3 }).run()"
          >
            3
          </div>
        </div>
      </div>
      <div class="btn" @click="editor?.chain().focus().setParagraph().run()">
        <i class="fa fa-paragraph" aria-hidden="true"></i>
      </div>
      <div
        class="btn"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <i class="fa fa-list" aria-hidden="true"></i>
      </div>
    </div>
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold,
    ListItem,
    BulletList,
    Heading.configure({ levels: [1, 2, 3] }),
  ],
  onUpdate: () => {
    emit("update:modelValue", editor.value?.getHTML());
  },
  autofocus: true,
  editable: props.editable,
});

let showHeaderOptions = ref(false);
</script>

<style scoped>
.editor {
  margin: 1em 0;
  background-color: var(--color-background-mute);
  text-align: start;
}

.btn.active {
  filter: brightness(1.2);
}

.editor-content {
  background-color: var(--color-background-soft);
  padding: 1em;
}
.controls {
  display: flex;
}
</style>

<style>
.ProseMirror {
  outline: none !important;
}
</style>
