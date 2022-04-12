, watchimport { useRoute } from "vue-router"; import { DocumentLinkNode } from
"./DocumentLinkNode";
<template>
  <div class="editor">
    <div class="controls">
      <!-- Block Styles -->
      <div
        class="btn"
        @click="showHeaderOptions = !showHeaderOptions"
        style="position: relative; z-index: 1"
      >
        <i class="fa fa-header" aria-hidden="true"></i>
        <div
          v-if="showHeaderOptions"
          style="
            position: absolute;
            z-index: 1;
            left: 0;
            top: 100%;
            width: 100%;
            text-align: center;
          "
        >
          <div
            class="btn"
            @click="editor?.chain().focus().setHeading({ level: 3 }).run()"
          >
            1
          </div>
          <div
            class="btn"
            @click="editor?.chain().focus().setHeading({ level: 4 }).run()"
          >
            2
          </div>
          <div
            class="btn"
            @click="editor?.chain().focus().setHeading({ level: 5 }).run()"
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

      <!-- Inline Styles -->
      <div
        :class="'btn ' + (editor?.isActive('bold') ? 'active' : '')"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <i class="fa fa-bold" aria-hidden="true"></i>
      </div>
      <div
        :class="'btn ' + (editor?.isActive('strike') ? 'active' : '')"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <i class="fa fa-strikethrough" aria-hidden="true"></i>
      </div>
      <div
        :class="'btn ' + (editor?.isActive('strike') ? 'active' : '')"
        @click="linkDocumentModal = true"
      >
        <i class="fa fa-link" aria-hidden="true"></i>
      </div>

      <!-- Controls -->
      <div class="btn" @click="$emit('save', editor?.getHTML())">save</div>
    </div>
    <EditorContent :editor="editor" class="editor-content" />

    <ModalComponent v-if="linkDocumentModal" @close="linkDocumentModal = false">
      <h2>Link Document</h2>
      <FolderTree
        :world-id="($route.params.worldId as string)"
        @select="linkDocument"
      ></FolderTree>
      <div class="btn" @click="linkDocumentModal = false">Cancel</div>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { ref, watch } from "vue";
import {
  DocumentLinkNode,
  DocumentLinkNodeExtension,
} from "./DocumentLinkNode.ts.old";
import ModalComponent from "../structure/ModalComponent.vue";
import FolderTree from "../noteExplorer/FolderTree.vue";

const props = defineProps({
  startContent: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save"]);

const editor = useEditor({
  content: props.startContent,
  extensions: [
    Document,
    Paragraph,
    BulletList,
    ListItem,
    Text,
    Bold,
    Strike,
    DocumentLinkNodeExtension,
    Heading.configure({ levels: [3, 4, 5] }),
  ],
  autofocus: true,
  editable: props.editable,
});
`
const showHeaderOptions = ref(false);
const linkDocumentModal = ref(false);
const linkDocument = (s: { id: string; type: "document" | "folder" }) => {
  linkDocumentModal.value = false;
  console.log(s);
  if (s.type === "folder") return;
  else if (s.type === "document")
    //editor.value?.chain().focus().insertContent(`@doc:${s.id};`).run();
    editor.value?.commands.insertContent(DocumentLinkNode);
};

watch(props, (p) => {
  editor.value?.commands.setContent(p.startContent);
});
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
  gap: 3px;
}
</style>

<style lang="scss">
.ProseMirror {
  outline: none !important;
}

.editor-content {
  font-family: Oooh Baby;
  h3 {
    font-size: xx-large;
  }
  h4 {
    font-size: x-large;
  }
  h5 {
    font-size: large;
  }
}
</style>
