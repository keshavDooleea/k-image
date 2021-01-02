import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  counter = 0;

  constructor() {
    chrome.storage.sync.get('counter', (data) => {
      this.counter = data.counter;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { command: 'onPopUpInit', counter: this.counter },
          (response) => {
            console.log(response.result);
          }
        );
      });
    });
  }

  inputChange(): void {
    // this.isChecked = !this.isChecked;
    // // update the extension storage value
    // chrome.storage.sync.set({ hide: this.isChecked }, () => {
    //   console.log('The value is' + this.isChecked);
    // });
    // const command = this.counter > 0 ? 'init' : 'remove';
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { command, hide: this.isChecked },
    //     (response) => {
    //       console.log(response.result);
    //     }
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
