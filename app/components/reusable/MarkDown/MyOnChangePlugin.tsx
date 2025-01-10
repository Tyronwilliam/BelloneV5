// When the editor changes, you can get notified via the

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getRoot } from "lexical";
import { useEffect } from "react";
import { $generateNodesFromDOM } from "@lexical/html";

// OnChangePlugin!
export function MyOnChangePlugin({ onChange }: { onChange: any }) {
  // Access the editor through the LexicalComposerContext
  const [editor] = useLexicalComposerContext();
  // Wrap our listener in useEffect to handle the teardown and avoid stale references.
  useEffect(() => {
    // most listeners return a teardown function that can be called to clean them up.
    return editor.registerUpdateListener(({ editorState }) => {
      // call onChange here to pass the latest state up to the parent.
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

interface Props {
  initialContent: string | undefined; // HTML content that you want to load into the editor
}

export const LoadInitialContent = ({ initialContent }: Props) => {
  const [editor] = useLexicalComposerContext();
  console.log(initialContent, "INITIAL CONTENT");
  useEffect(() => {
    if (!initialContent) {
      return;
    }

    try {
      const parsedState = JSON.parse(initialContent);

      editor.update(() => {
        // Load the state into the editor
        const editorState = editor.parseEditorState(parsedState);
        editor.setEditorState(editorState);
      });
    } catch (error) {
      console.error("Failed to load initial content:", error);
    }
  }, [editor, initialContent]); // Make sure to rerun effect when `initialContent` changes

  return null; // This component doesn't render anything itself
};
