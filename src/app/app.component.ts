import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'k-image';

  constructor() {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { msg: 'getFonts' },
    //     (response) => {}
    //   );
    // });
  }

  btnClicked(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(
        tabs[0].id,
        {
          code: 'document.body.style.backgroundColor = "' + 'blue' + '";',
        },
        (result) => {
          console.log(result);
        }
      );
    });
  }
}
