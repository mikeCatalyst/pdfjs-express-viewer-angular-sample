import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import WebViewer from '@pdftron/pdfjs-express-viewer';
const nextIcon = '<svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path></svg>'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer', { static: false }) viewer: ElementRef;
  wvInstance: any;

  ngAfterViewInit(): void {

    WebViewer({
      path: '../lib',
      initialDoc: '../files/demo.pdf'
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;
      // now you can access APIs through the WebViewer instance
      const {Core} = instance;

      // adding an event listener for when a document is loaded
      Core.documentViewer.addEventListener('documentLoaded', () => {
        console.log('document loaded');
      });

      // adding an event listener for when the page number has changed
      Core.documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
        console.log(`Page number is: ${pageNumber}`);
      });
    });
  }

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  wvDocumentLoadedHandler(): void {
    // you can access the instance object for low-level APIs
    const instance = this.wvInstance;
    const {Core, UI} = instance;
    // adds a button to the header that on click sets the page to the next page
    UI.setHeaderItems(header => {
      header.push({
        type: 'actionButton',
        img: 'https://icons.getbootstrap.com/assets/icons/caret-right-fill.svg',
        onClick: () => {
          const currentPage = Core.documentViewer.getCurrentPage();
          const totalPages = Core.documentViewer.getPageCount();
          const atLastPage = currentPage === totalPages;

          if (atLastPage) {
            Core.documentViewer.setCurrentPage(1);
          } else {
            Core.documentViewer.setCurrentPage(currentPage + 1);
          }
        }
      });
    });
  }
}
