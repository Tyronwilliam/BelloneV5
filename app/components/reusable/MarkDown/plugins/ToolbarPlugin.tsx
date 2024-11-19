// // /**
// //  * Copyright (c) Meta Platforms, Inc. and affiliates.
// //  *
// //  * This source code is licensed under the MIT license found in the
// //  * LICENSE file in the root directory of this source tree.
// //  *
// //  */
import {
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  ParagraphNode,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

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
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
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
  const [url, setUrl] = useState("");
  const [textUrl, settextUrl] = useState("");

  const insertUrl = useCallback((text: string, link: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const linkNode = $createLinkNode(link, { target: "_blank" });
        linkNode.append($createTextNode(text));
        selection.anchor.getNode().insertAfter(linkNode);
      }
    });
    setDialogOpen(false);
  }, []);

  const removeLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }, [editor]);

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
        onClick={openDialog}
        className={"toolbar-item spaced  " + (isLink ? "active" : "")}
        aria-label={isLink ? "Remove Link" : "Insert Link"}
      >
        <Link className="w-[15px] h-auto  text-black " />
        {/* <i className={isLink ? "format unlink" : "format link"} /> */}
      </button>
      <Dialog open={isDialogOpen} onOpenChange={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Enter the URL for the link you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 flex flex-col">
            <Input
              value={textUrl}
              onChange={(e: any) => settextUrl(e.target.value)}
              placeholder="Mon lien"
              className="w-full"
            />
            <Input
              value={url}
              onChange={(e: any) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog()}>
              Cancel
            </Button>
            <Button onClick={() => insertUrl(textUrl, url)}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// import {
//   $getSelection,
//   $isRangeSelection,
//   FORMAT_TEXT_COMMAND,
//   SELECTION_CHANGE_COMMAND,
//   TOGGLE_LINK_COMMAND,
// } from "lexical";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { mergeRegister } from "@lexical/utils";
// import { useCallback, useEffect, useState } from "react";
// import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
// import { $isLinkNode } from "@lexical/link";
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogClose,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const LowPriority = 1;

// function Divider() {
//   return <div className="divider" />;
// }

// export default function Toolbar() {
//   const [editor] = useLexicalComposerContext();
//   const [isBold, setIsBold] = useState(false);
//   const [isItalic, setIsItalic] = useState(false);
//   const [isUnderline, setIsUnderline] = useState(false);
//   const [isLink, setIsLink] = useState(false);
//   const [linkUrl, setLinkUrl] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const $updateToolbar = useCallback(() => {
//     const selection = $getSelection();
//     if ($isRangeSelection(selection)) {
//       // Update text format states
//       setIsBold(selection.hasFormat("bold"));
//       setIsItalic(selection.hasFormat("italic"));
//       setIsUnderline(selection.hasFormat("underline"));

//       // Check if the selection is in a link
//       const anchorNode = selection.anchor.getNode();
//       const focusNode = selection.focus.getNode();
//       const isLinkNode =
//         $isLinkNode(anchorNode.getParent()) ||
//         $isLinkNode(focusNode.getParent());
//       setIsLink(isLinkNode);
//     }
//   }, []);

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerUpdateListener(({ editorState }) => {
//         editorState.read(() => {
//           $updateToolbar();
//         });
//       }),
//       editor.registerCommand(
//         SELECTION_CHANGE_COMMAND,
//         (_payload, _newEditor) => {
//           $updateToolbar();
//           return false;
//         },
//         LowPriority
//       )
//     );
//   }, [editor, $updateToolbar]);

//   const toggleLink = useCallback(() => {
//     if (isLink) {
//       // Remove link
//       editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
//     } else {
//       // Open dialog to add a link
//       setIsDialogOpen(true);
//     }
//   }, [editor, isLink]);

//   const handleLinkSubmit = useCallback(() => {
//     if (linkUrl) {
//       editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
//       setIsDialogOpen(false); // Close the dialog
//     }
//   }, [editor, linkUrl]);

//   return (
//     <div className="toolbar">
//       <button
//         onClick={() => {
//           editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
//         }}
//         className={"toolbar-item spaced " + (isBold ? "active" : "")}
//         aria-label="Format Bold"
//       >
//         <i className="format bold" />
//       </button>
//       <button
//         onClick={() => {
//           editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
//         }}
//         className={"toolbar-item spaced " + (isItalic ? "active" : "")}
//         aria-label="Format Italics"
//       >
//         <i className="format italic" />
//       </button>
//       <button
//         onClick={() => {
//           editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
//         }}
//         className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
//         aria-label="Format Underline"
//       >
//         <i className="format underline" />
//       </button>
//       <Divider />
//       <button
//         onClick={toggleLink}
//         className={"toolbar-item spaced " + (isLink ? "active" : "")}
//         aria-label={isLink ? "Remove Link" : "Insert Link"}
//       >
//         <i className={isLink ? "format unlink" : "format link"} />
//       </button>

//       {/* Link Dialog from Shadcn  */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogTrigger>
//           <button>Link</button>{" "}
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Insert Link</DialogTitle>
//             <DialogDescription>
//               Enter the URL for the link you want to add.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Input
//               value={linkUrl}
//               onChange={(e: any) => setLinkUrl(e.target.value)}
//               placeholder="https://example.com"
//               className="w-full"
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleLinkSubmit}>Insert Link</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
