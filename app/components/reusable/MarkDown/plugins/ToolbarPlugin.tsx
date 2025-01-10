// // /**
// //  * Copyright (c) Meta Platforms, Inc. and affiliates.
// //  *
// //  * This source code is licensed under the MIT license found in the
// //  * LICENSE file in the root directory of this source tree.
// //  *
// //  */
import { $createLinkNode, $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

// import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useToggle } from "@/hooks/useToggle";
import { toast } from "@/hooks/use-toast";
import LinkDialog from "../../Dialog/LinkDialog";
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}
const blockTypeToBlockName = {
  bullet: "Bulleted List",
  number: "Numbered List",
  check: "Check List",
  paragraph: "Normal",
};
export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const { value: isDialogLink, toggleValue: toggleDialogLink } = useToggle();
  const { value: isDialogImage, toggleValue: toggleDialogImage } = useToggle();
  const [url, setUrl] = useState("");
  const [textUrl, setTextUrl] = useState("");
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [currentList, setCurrentList] = useState("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Check if selection is within a link
      const anchorNode = selection.anchor.getNode();
      const focusNode = selection.focus.getNode();
      const isLinkNode =
        $isLinkNode(anchorNode.getParent()) ||
        $isLinkNode(focusNode.getParent());
      setIsLink(isLinkNode);
    }
  }, []);

  const formatList = (listType: string) => {
    console.log(blockType);
    setCurrentList(listType);
    if (listType === "number" && blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType("number");
    } else if (listType === "bullet" && blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType("bullet");
    } else if (listType === "check" && blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      setBlockType("check");
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType("paragraph");
    }
  };
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  const insertUrl = useCallback(
    (text: string, link: string) => {
      if (!text || !link) {
        toast({
          title: "Text or Link need a value",
          description: "Please add a link and a text",
          variant: "destructive",
        });
        return;
      }
      const normalizedLink =
        link.startsWith("http://") || link.startsWith("https://")
          ? link
          : `https://${link}`;
      editor.update(() => {
        const root = $getRoot(); // Get the root node of the Lexical editor.
        const paragraph = $createParagraphNode(); // Create a new paragraph node.
        const linkNode = $createLinkNode(normalizedLink); // Create a link node with the given URL.

        linkNode.append($createTextNode(text)); // Add text inside the link node.
        // A voir si vraiment utile
        paragraph.append(linkNode); // Add the link node to the paragraph.
        root.append(paragraph); // Add the paragraph to the root.
      });

      toggleDialogLink();
    },
    [editor]
  );

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={toggleDialogLink}
        className={"toolbar-item spaced " + (isLink ? "active" : "")}
        aria-label={isLink ? "Remove Link" : "Insert Link"}
      >
        <i className="format link" />
      </button>
      {/* lIST */}
      <button
        disabled={false}
        className={
          "toolbar-item spaced " + (currentList === "bullet" ? "active" : "")
        }
        onClick={() => formatList("bullet")}
        aria-label="Format bullet"
      >
        <i className="format bullet" />
      </button>
      <button
        disabled={false}
        className={
          "toolbar-item spaced " + (currentList === "number" ? "active" : "")
        }
        onClick={() => formatList("number")}
        aria-label="Format order"
      >
        <i className="format order" />
      </button>
      <button
        disabled={false}
        className={
          "toolbar-item spaced " + (currentList === "check" ? "active" : "")
        }
        onClick={() => formatList("check")}
        aria-label="Format check"
      >
        <i className="format check" />
      </button>

      <LinkDialog
        isOpen={isDialogLink}
        onClose={toggleDialogLink}
        textUrl={textUrl}
        setTextUrl={setTextUrl}
        url={url}
        setUrl={setUrl}
        onInsert={insertUrl}
      />
    </div>
  );
}
