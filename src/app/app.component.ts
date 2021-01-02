import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isChecked: boolean;
  @ViewChild('inputElement') inputElement: HTMLInputElement;

  constructor() {
    chrome.storage.sync.get('hide', (data) => {
      console.log('INNNNN ', data.hide);
      this.inputElement.checked = data.hide;
      this.isChecked = data.hide;
    });
  }

  inputChange(): void {
    this.isChecked = !this.isChecked;

    // update the extension storage value
    chrome.storage.sync.set({ hide: this.isChecked }, () => {
      console.log('The value is' + this.isChecked);
    });

    const command = this.isChecked ? 'init' : 'remove';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { command, hide: this.isChecked },
        (response) => {
          console.log(response.result);
        }
      );
    });
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
