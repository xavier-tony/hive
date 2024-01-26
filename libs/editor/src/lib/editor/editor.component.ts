import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodemirrorComponent, CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/lint/lint';
import * as HTMLHint from 'htmlhint';
import 'codemirror/addon/lint/html-lint';
import 'codemirror/addon/lint/css-lint';
import 'codemirror/addon/lint/javascript-lint';
// import 'codemirror/addon/emmet/show-hint';
import 'codemirror/keymap/sublime';

import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closetag';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import { Token } from 'codemirror';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Import Emmet
// import 'codemirror/addon/emmet/emmet';
// import 'codemirror/addon/emmet/javascript';

@Component({
  selector: 'hive-editor',
  standalone: true,
  imports: [CommonModule, CodemirrorModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {
  constructor(private sanitizer: DomSanitizer) {}

  @ViewChild(CodemirrorComponent, { static: false })
  codemirrorComponent!: CodemirrorComponent;

  showDropdown = false; // or implement logic to decide when to show
  dropdownStyle = {};

  content: string = `<div>Hi 
    <strong>Shawn !</strong>
  </div>`;
  viewContent: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.content);

  options = {
    lineNumbers: true,
    theme: 'idea',
    mode: 'htmlmixed',
    spellcheck: true,
    autocorrect: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: [
      'CodeMirror-linenumbers',
      'CodeMirror-foldgutter',
      'CodeMirror-lint-markers',
    ],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,

    lintWith: HTMLHint,
    autoCloseTags: true,
    extraKeys: {
      Tab: 'emmetExpandAbbreviation', // Bind Tab key to expand Emmet abbreviation
    },
    keyMap: 'sublime', // Use 'sublime' keymap
    matchTags: { bothTags: true }, // Enable matching open and close tags
    emmet: true,
  };

  onCodeChange(): void {
    this.viewContent = this.sanitizer.bypassSecurityTrustHtml(
      String(this.renderMathInHtml(this.content))
    );
    console.log(this.viewContent);
  }

  onCursorActivity(e: any): void {
    console.log(e);
    if (this.codemirrorComponent) {
      const codeMirror = this.codemirrorComponent?.codeMirror;
      if (codeMirror) {
        const doc = codeMirror.getDoc();
        const cursor = doc.getCursor();
        if (cursor) {
          // const token: Token | undefined = codeMirror?.getTokenAt(cursor);
            const token = doc.getRange(
              { line: cursor.line, ch: cursor.ch - 1 },
              cursor
            );

          if (token) {
            const coords = codeMirror.cursorCoords(cursor, 'window');
            console.log(token);
            if (token === '/') {
              this.showDropdown = true; // or implement logic to decide when to show
              this.dropdownStyle = {
                left: coords.left + 'px',
                top: coords.bottom + 'px',
              };
              console.log('show dropdown');
              // Position your dropdown based on the cursor position
              // You might need to calculate the position on the screen based on the cursor
            } else {
              this.showDropdown = false;
              console.log('hide dropdown');
            }
          }
        }
      }
    }
  }

  renderMathInHtml(htmlString: string) {
    // Create a temporary DOM element to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Use KaTeX to render math formulas inside the temporary div
    (window as any).renderMathInElement(tempDiv, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        // ... add other delimiters as needed
      ],
      throwOnError: false, // Set to true if you want parsing errors to throw exceptions
    });

    console.log(tempDiv);

    // Return the inner HTML of the temporary div
    return tempDiv.innerHTML;
  }

  embed(value: string) {
    if (value) {
      console.log(value);

      const codeMirror = this.codemirrorComponent?.codeMirror;
      if (codeMirror) {
        const doc = codeMirror.getDoc();
        const cursor = doc.getCursor();

        if (cursor) {
          // Remove the '/'
          doc.replaceRange(
            '',
            { line: cursor.line, ch: cursor.ch - 1 },
            cursor
          );

          // Insert the HTML
          const posAfterSlashRemoved = doc.getCursor(); // Get the cursor position again after removing '/'
          doc.replaceRange(`<input type="text">`, posAfterSlashRemoved);
        }
      }
    }
    this.showDropdown = false;
  }
}
